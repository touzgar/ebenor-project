/**
 * Example Product Form Component
 * 
 * This is a reference implementation showing how to use the useProductForm hook
 * and validation schema. This file serves as documentation and can be adapted
 * for actual product creation/editing forms.
 * 
 * DO NOT DELETE - This is a reference implementation
 */

import React from 'react';
import { useProductForm, useProductTags, useProductMaterials } from '@/hooks/useProductForm';
import { PRODUCT_CATEGORIES, PRODUCT_AVAILABILITY } from '@/lib/validations/product';
import type { ProductFormData } from '@/lib/validations/product';

interface ProductFormExampleProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => Promise<void>;
  onCancel?: () => void;
}

/**
 * Example implementation of a product form using useProductForm hook
 */
export function ProductFormExample({
  initialData,
  onSubmit,
  onCancel,
}: ProductFormExampleProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    generateSlugFromName,
    generateSeoFromContent,
  } = useProductForm({
    defaultValues: initialData,
    onSubmit,
    autoGenerateSlug: true,
    autoGenerateSeo: true,
  });

  // Helper hooks for array fields
  const { tags, addTag, removeTag } = useProductTags({ watch, setValue: () => {}, formState: {} as any } as any);
  const { materials, addMaterial, removeMaterial } = useProductMaterials({ watch, setValue: () => {}, formState: {} as any } as any);

  const [newTag, setNewTag] = React.useState('');
  const [newMaterial, setNewMaterial] = React.useState('');

  const handleAddTag = () => {
    if (newTag.trim()) {
      addTag(newTag);
      setNewTag('');
    }
  };

  const handleAddMaterial = () => {
    if (newMaterial.trim()) {
      addMaterial(newMaterial);
      setNewMaterial('');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Informations de base</h2>
        
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nom du produit *
          </label>
          <input
            id="name"
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Table en bois massif"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Slug */}
        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug (URL) *
          </label>
          <div className="flex gap-2">
            <input
              id="slug"
              type="text"
              {...register('slug')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="table-en-bois-massif"
            />
            <button
              type="button"
              onClick={generateSlugFromName}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Générer
            </button>
          </div>
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie *
          </label>
          <select
            id="category"
            {...register('category')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sélectionner une catégorie</option>
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
          )}
        </div>

        {/* Subcategory */}
        <div className="mb-4">
          <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
            Sous-catégorie
          </label>
          <input
            id="subcategory"
            type="text"
            {...register('subcategory')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Tables basses"
          />
          {errors.subcategory && (
            <p className="mt-1 text-sm text-red-600">{errors.subcategory.message}</p>
          )}
        </div>
      </section>

      {/* Descriptions Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Descriptions</h2>

        {/* Short Description */}
        <div className="mb-4">
          <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description courte * (max 300 caractères)
          </label>
          <textarea
            id="shortDescription"
            {...register('shortDescription')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Résumé court du produit"
          />
          <p className="mt-1 text-sm text-gray-500">
            {watch('shortDescription')?.length || 0} / 300
          </p>
          {errors.shortDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.shortDescription.message}</p>
          )}
        </div>

        {/* Full Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description complète * (max 5000 caractères)
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="Description détaillée du produit"
          />
          <p className="mt-1 text-sm text-gray-500">
            {watch('description')?.length || 0} / 5000
          </p>
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>
      </section>

      {/* Materials & Finishes Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Matériaux et Finitions</h2>

        {/* Materials */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Matériaux
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddMaterial())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Bois de chêne"
            />
            <button
              type="button"
              onClick={handleAddMaterial}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((material, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
              >
                {material}
                <button
                  type="button"
                  onClick={() => removeMaterial(index)}
                  className="text-gray-500 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Availability Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Disponibilité</h2>

        <div className="mb-4">
          <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-1">
            Statut *
          </label>
          <select
            id="availability"
            {...register('availability')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            {PRODUCT_AVAILABILITY.map((status) => (
              <option key={status} value={status}>
                {status === 'in_stock' && 'En stock'}
                {status === 'made_to_order' && 'Sur commande'}
                {status === 'out_of_stock' && 'Rupture de stock'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('featured')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Produit mis en avant
            </span>
          </label>
        </div>
      </section>

      {/* SEO Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">SEO</h2>
          <button
            type="button"
            onClick={generateSeoFromContent}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Auto-générer
          </button>
        </div>

        {/* SEO Title */}
        <div className="mb-4">
          <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Titre SEO (max 60 caractères)
          </label>
          <input
            id="seoTitle"
            type="text"
            {...register('seoTitle')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {watch('seoTitle')?.length || 0} / 60
          </p>
          {errors.seoTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.seoTitle.message}</p>
          )}
        </div>

        {/* SEO Description */}
        <div className="mb-4">
          <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description SEO (max 160 caractères)
          </label>
          <textarea
            id="seoDescription"
            {...register('seoDescription')}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {watch('seoDescription')?.length || 0} / 160
          </p>
          {errors.seoDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.seoDescription.message}</p>
          )}
        </div>
      </section>

      {/* Tags Section */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Tags</h2>

        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: moderne"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Ajouter
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="text-blue-500 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
