import { Request, Response, NextFunction } from 'express';
import { Product } from '@/models/Product';
import { ApiError, ERROR_CODES } from '@/middleware/errorHandler';
import { ApiResponse, PaginatedResponse } from '@/types';
import { logger } from '@/utils/logger';
import { MockDataService } from '@/services/mockDataService';
import { cacheService } from '@/services/cacheService';
import { measureQueryPerformance } from '@/middleware/queryPerformance';

export class ProductController {
  /**
   * Obtenir tous les produits avec pagination et filtres
   * Optimized with caching and lean queries
   */
  public async getProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let products, total;
      
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const skip = (page - 1) * limit;

        // Construire les filtres
        const filters: any = {};
        
        if (req.query.category) {
          filters.category = req.query.category;
        }
        
        if (req.query.subcategory) {
          filters.subcategory = req.query.subcategory;
        }
        
        if (req.query.featured !== undefined) {
          filters.featured = req.query.featured === 'true';
        }
        
        if (req.query.availability) {
          filters.availability = req.query.availability;
        }

        // Filtres de prix
        if (req.query.minPrice || req.query.maxPrice) {
          filters['price.amount'] = {};
          if (req.query.minPrice) {
            filters['price.amount'].$gte = parseFloat(req.query.minPrice as string);
          }
          if (req.query.maxPrice) {
            filters['price.amount'].$lte = parseFloat(req.query.maxPrice as string);
          }
        }

        // Recherche textuelle
        if (req.query.search) {
          filters.$text = { $search: req.query.search };
        }

        // Tri
        let sort: any = { createdAt: -1 }; // Par défaut, plus récents en premier
        
        if (req.query.sort) {
          const sortField = req.query.sort as string;
          if (sortField.startsWith('-')) {
            sort = { [sortField.substring(1)]: -1 };
          } else {
            sort = { [sortField]: 1 };
          }
        }

        // Create cache key from filters
        const cacheKey = cacheService.getProductsList(JSON.stringify({ filters, sort, page, limit }));
        
        // Try to get from cache
        const cached = cacheService.getProductsList(JSON.stringify({ filters, sort, page, limit }));
        if (cached) {
          logger.debug('Products list served from cache');
          return res.status(200).json(cached);
        }

        // Exécuter la requête avec pagination - optimized with lean()
        [products, total] = await measureQueryPerformance(async () => {
          return Promise.all([
            Product.find(filters)
              .select('-__v -createdBy -updatedBy') // Limit fields
              .sort(sort)
              .skip(skip)
              .limit(limit)
              .lean(), // Use lean for better performance
            Product.countDocuments(filters)
          ]);
        }, 'getProducts');

      } catch (dbError) {
        // Si MongoDB n'est pas disponible, utiliser les données de test
        logger.warn('MongoDB non disponible, utilisation des données de test pour les produits', { error: dbError });
        const mockProducts = MockDataService.getProducts();
        
        // Appliquer les filtres basiques sur les données de test
        let filteredProducts = mockProducts;
        
        if (req.query.category) {
          filteredProducts = filteredProducts.filter(p => p.category === req.query.category);
        }
        
        if (req.query.featured !== undefined) {
          const featured = req.query.featured === 'true';
          filteredProducts = filteredProducts.filter(p => p.featured === featured);
        }
        
        products = filteredProducts;
        total = filteredProducts.length;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<typeof products[0]> = {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
        },
      };

      // Cache the response
      cacheService.setProductsList(JSON.stringify({ 
        filters: req.query, 
        sort: req.query.sort, 
        page, 
        limit 
      }), response);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un produit par son slug
   * Optimized with caching
   */
  public async getProductBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      // Try to get from cache
      const cached = cacheService.getProductBySlug(slug);
      if (cached) {
        logger.debug('Product served from cache', { slug });
        return res.status(200).json({ success: true, data: cached });
      }

      const product = await measureQueryPerformance(
        () => Product.findOne({ slug }).select('-__v').lean(),
        'getProductBySlug'
      );

      if (!product) {
        throw new ApiError(
          'Produit non trouvé',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      // Cache the product
      cacheService.setProductBySlug(slug, product);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir un produit par son ID
   * Optimized with caching
   */
  public async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      // Try to get from cache
      const cached = cacheService.getProductById(id);
      if (cached) {
        logger.debug('Product served from cache', { id });
        return res.status(200).json({ success: true, data: cached });
      }

      const product = await measureQueryPerformance(
        () => Product.findById(id).select('-__v').lean(),
        'getProductById'
      );

      if (!product) {
        throw new ApiError(
          'Produit non trouvé',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      // Cache the product
      cacheService.setProductById(id, product);

      const response: ApiResponse = {
        success: true,
        data: product,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les produits en vedette
   * Optimized with caching
   */
  public async getFeaturedProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let products;
      
      try {
        const limit = parseInt(req.query.limit as string) || 6;

        // Try to get from cache
        const cached = cacheService.getFeaturedProducts(limit);
        if (cached) {
          logger.debug('Featured products served from cache', { limit });
          return res.status(200).json({ success: true, data: cached });
        }

        products = await measureQueryPerformance(
          () => Product.find({ featured: true })
            .select('-__v -createdBy -updatedBy')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean(),
          'getFeaturedProducts'
        );

        // Cache the featured products
        cacheService.setFeaturedProducts(limit, products);

      } catch (dbError) {
        // Si MongoDB n'est pas disponible, utiliser les données de test
        logger.warn('MongoDB non disponible, utilisation des données de test pour les produits en vedette', { error: dbError });
        const mockProducts = MockDataService.getProducts();
        const limit = parseInt(req.query.limit as string) || 6;
        products = mockProducts.filter(p => p.featured).slice(0, limit);
      }

      const response: ApiResponse = {
        success: true,
        data: products,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les catégories de produits disponibles
   */
  public async getCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await Product.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            subcategories: { $addToSet: '$subcategory' }
          }
        },
        {
          $project: {
            category: '$_id',
            count: 1,
            subcategories: {
              $filter: {
                input: '$subcategories',
                cond: { $ne: ['$$this', null] }
              }
            }
          }
        },
        { $sort: { category: 1 } }
      ]);

      const response: ApiResponse = {
        success: true,
        data: categories,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rechercher des produits
   */
  public async searchProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        throw new ApiError(
          'Terme de recherche requis (minimum 2 caractères)',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }

      const searchTerm = q.trim();
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const skip = (page - 1) * limit;

      // Recherche avec score de pertinence
      const products = await Product.find(
        { $text: { $search: searchTerm } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' }, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await Product.countDocuments({
        $text: { $search: searchTerm }
      });

      const totalPages = Math.ceil(total / limit);

      const response: PaginatedResponse<typeof products[0]> = {
        success: true,
        data: products,
        pagination: {
          page,
          limit,
          total,
          pages: totalPages,
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir des produits similaires
   */
  public async getSimilarProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 4;

      // Récupérer le produit de référence
      const product = await Product.findById(id);
      
      if (!product) {
        throw new ApiError(
          'Produit non trouvé',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      // Trouver des produits similaires basés sur la catégorie et les tags
      const similarProducts = await Product.find({
        _id: { $ne: id },
        $or: [
          { category: product.category },
          { tags: { $in: product.tags } }
        ]
      })
        .sort({ featured: -1, createdAt: -1 })
        .limit(limit)
        .lean();

      const response: ApiResponse = {
        success: true,
        data: similarProducts,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtenir les statistiques des produits
   */
  public async getProductStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const stats = await Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts: { $sum: 1 },
            featuredProducts: {
              $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] }
            },
            categoriesCount: { $addToSet: '$category' },
            avgPrice: { $avg: '$price.amount' },
            minPrice: { $min: '$price.amount' },
            maxPrice: { $max: '$price.amount' }
          }
        },
        {
          $project: {
            _id: 0,
            totalProducts: 1,
            featuredProducts: 1,
            categoriesCount: { $size: '$categoriesCount' },
            avgPrice: { $round: ['$avgPrice', 2] },
            minPrice: 1,
            maxPrice: 1
          }
        }
      ]);

      const response: ApiResponse = {
        success: true,
        data: stats[0] || {
          totalProducts: 0,
          featuredProducts: 0,
          categoriesCount: 0,
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  // ==================== ADMIN ENDPOINTS ====================

  /**
   * Créer un nouveau produit (Admin only)
   * Invalidates cache after creation
   */
  public async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const productData = req.body;

      // Ajouter l'utilisateur créateur
      if (req.user) {
        productData.createdBy = req.user.id;
        productData.updatedBy = req.user.id;
      }

      // Créer le produit
      const product = new Product(productData);
      await product.save();

      // Invalidate product caches
      cacheService.invalidateProducts();

      logger.info('Product created', { productId: product._id, name: product.name });

      const response: ApiResponse = {
        success: true,
        data: product.toPublicJSON(),
        message: 'Produit créé avec succès',
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Mettre à jour un produit (Admin only)
   * Invalidates cache after update
   */
  public async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const product = await Product.findById(id);

      if (!product) {
        throw new ApiError(
          'Produit non trouvé',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      const oldSlug = product.slug;

      // Ajouter l'utilisateur qui fait la mise à jour
      if (req.user) {
        updateData.updatedBy = req.user.id;
      }

      // Mettre à jour les champs
      Object.assign(product, updateData);
      await product.save();

      // Invalidate specific product cache and lists
      cacheService.invalidateProduct(id, oldSlug);

      logger.info('Product updated', { productId: product._id, name: product.name });

      const response: ApiResponse = {
        success: true,
        data: product.toPublicJSON(),
        message: 'Produit mis à jour avec succès',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Supprimer un produit (Admin only)
   * Invalidates cache after deletion
   */
  public async deleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const product = await Product.findById(id);

      if (!product) {
        throw new ApiError(
          'Produit non trouvé',
          404,
          ERROR_CODES.NOT_FOUND
        );
      }

      await Product.findByIdAndDelete(id);

      // Invalidate product caches
      cacheService.invalidateProduct(id, product.slug);

      logger.info('Product deleted', { productId: id, name: product.name });

      const response: ApiResponse = {
        success: true,
        message: 'Produit supprimé avec succès',
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Opérations en masse sur les produits (Admin only)
   * Invalidates cache after bulk operations
   */
  public async bulkOperations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { action, productIds, data } = req.body;

      if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
        throw new ApiError(
          'Action et IDs de produits requis',
          400,
          ERROR_CODES.VALIDATION_ERROR
        );
      }

      let result;

      switch (action) {
        case 'delete':
          result = await Product.deleteMany({ _id: { $in: productIds } });
          logger.info('Bulk delete products', { count: result.deletedCount });
          break;

        case 'feature':
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { featured: true } }
          );
          logger.info('Bulk feature products', { count: result.modifiedCount });
          break;

        case 'unfeature':
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { featured: false } }
          );
          logger.info('Bulk unfeature products', { count: result.modifiedCount });
          break;

        case 'changeCategory':
          if (!data || !data.category) {
            throw new ApiError(
              'Catégorie requise pour cette action',
              400,
              ERROR_CODES.VALIDATION_ERROR
            );
          }
          result = await Product.updateMany(
            { _id: { $in: productIds } },
            { $set: { category: data.category, subcategory: data.subcategory || null } }
          );
          logger.info('Bulk change category', { count: result.modifiedCount, category: data.category });
          break;

        default:
          throw new ApiError(
            'Action non reconnue',
            400,
            ERROR_CODES.VALIDATION_ERROR
          );
      }

      // Invalidate all product caches after bulk operations
      cacheService.invalidateProducts();

      const response: ApiResponse = {
        success: true,
        data: result,
        message: `Opération "${action}" effectuée avec succès`,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

// Instance du contrôleur de produits
export const productController = new ProductController();