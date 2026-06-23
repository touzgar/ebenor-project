import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler } from '@/lib/api-handler';
import { requireAuth } from '@/lib/auth/helpers';
import { GalleryImage } from '@/lib/models/GalleryImage';
import { Product } from '@/lib/models/Product';

// GET - Get all media with pagination and filters

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export const GET = withApiHandler(async (request: NextRequest) => {
  await requireAuth(request);

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '24');
  const skip = (page - 1) * limit;
  const search = searchParams.get('search');
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const type = searchParams.get('type'); // 'all', 'image', 'video'

  const query: any = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { alt: { $regex: search, $options: 'i' } },
    ];
  }

  if (category) query.category = category;
  if (source && source !== 'all') query.source = source;
  
  // Filter by type
  if (type && type !== 'all') {
    if (type === 'video') {
      query.mimeType = { $regex: '^video/' };
    } else if (type === 'image') {
      query.$or = [
        { mimeType: { $regex: '^image/' } },
        { mimeType: { $exists: false } }, // Include items without mimeType (legacy)
      ];
    }
  }

  // Fetch from GalleryImage collection
  const [galleryMedia, galleryTotal] = await Promise.all([
    GalleryImage.find(query)
      .sort({ uploadedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    GalleryImage.countDocuments(query),
  ]);

  // Fetch product images from Product.images array (only if not filtering by source or if source is 'product')
  let productImages: any[] = [];
  let productImagesTotal = 0;

  if (!source || source === 'all' || source === 'product') {
    const products = await Product.find({}).select('_id name images category createdAt').lean();
    
    // Flatten product images
    productImages = products.flatMap(product => 
      (product.images || []).map((img: any, index: number) => ({
        _id: `product-${product._id}-${index}`,
        id: `product-${product._id}-${index}`,
        url: img.url || img,
        thumbnailUrl: img.thumbnailUrl || img.url || img,
        filename: img.filename || `Image ${index + 1}`,
        title: img.alt || product.name || `Image ${index + 1}`,
        alt: img.alt || product.name,
        type: 'image',
        mimeType: 'image/jpeg',
        size: 0,
        fileSize: 0,
        category: product.category || 'product',
        source: 'product',
        sourceId: product._id.toString(),
        uploadedAt: img.uploadedAt || product.createdAt,
        createdAt: product.createdAt,
        references: [{
          type: 'product',
          id: product._id.toString(),
          name: product.name,
          field: 'images',
        }],
      }))
    );

    // Apply search filter to product images if needed
    if (search) {
      productImages = productImages.filter(img => 
        img.title?.toLowerCase().includes(search.toLowerCase()) ||
        img.alt?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (type === 'video') {
      productImages = []; // Products only have images, not videos
    }

    productImagesTotal = productImages.length;

    // Apply pagination to combined results
    const combinedMedia = [...galleryMedia, ...productImages];
    const totalCombined = galleryTotal + productImagesTotal;
    
    // Sort combined results by date
    combinedMedia.sort((a, b) => {
      const dateA = new Date(a.uploadedAt || a.createdAt).getTime();
      const dateB = new Date(b.uploadedAt || b.createdAt).getTime();
      return dateB - dateA;
    });

    // Paginate combined results
    const paginatedMedia = combinedMedia.slice(skip, skip + limit);

    return NextResponse.json({
      success: true,
      data: paginatedMedia,
      pagination: {
        page,
        limit,
        total: totalCombined,
        pages: Math.ceil(totalCombined / limit),
      },
    });
  }

  // If filtering by specific source (not product), return only gallery media
  const mediaWithReferences = await Promise.all(
    galleryMedia.map(async (item: any) => {
      // Find products that reference this image
      const referencingProducts = await Product.find({
        $or: [
          { 'images.url': item.url },
          { 'images.thumbnailUrl': item.thumbnailUrl },
        ],
      }).select('_id name').lean();

      return {
        ...item,
        id: item._id.toString(),
        type: item.mimeType?.startsWith('video/') ? 'video' : 'image',
        references: referencingProducts.map((p: any) => ({
          type: 'product',
          id: p._id.toString(),
          name: p.name,
          field: 'images',
        })),
        source: item.source || 'upload',
      };
    })
  );

  return NextResponse.json({
    success: true,
    data: mediaWithReferences,
    pagination: {
      page,
      limit,
      total: galleryTotal,
      pages: Math.ceil(galleryTotal / limit),
    },
  });
});

// DELETE - Delete multiple media items
export const DELETE = withApiHandler(async (request: NextRequest) => {
  const user = await requireAuth(request);

  const { ids } = await request.json();

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json(
      {
        success: false,
        message: 'IDs requis',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 }
    );
  }

  const result = await GalleryImage.deleteMany({ _id: { $in: ids } });

  console.log(`âœ… Deleted ${result.deletedCount} media items by ${user.email}`);

  return NextResponse.json({
    success: true,
    data: { deletedCount: result.deletedCount },
    message: `${result.deletedCount} mÃ©dia(s) supprimÃ©(s) avec succÃ¨s`,
  });
});
