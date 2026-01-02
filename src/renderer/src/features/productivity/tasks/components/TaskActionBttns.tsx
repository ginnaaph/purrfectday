import { Button } from '@/components/ui/button'

interface ModalActionButtonsProps {
  isEditing: boolean
  onCancel: () => void
  onEdit: () => void
  isSubmitting: boolean
}

export const ModalActionButtons = ({
  isEditing,
  onCancel,
  onEdit,
  isSubmitting
}: ModalActionButtonsProps) => (
  <div className="flex justify-end gap-2 mt-6">
    {isEditing ? (
      <>
        <Button type="button" onClick={onCancel} variant="outline" disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-green shadow-sm hover:bg-[#f5e8da] text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </>
    ) : (
      <Button
        type="button"
        onClick={onEdit}
        className="bg-green hover:bg-[#f5e8da] text-white px-4 py-2  shadow-sm rounded text-sm"
      >
        Edit
      </Button>
    )}
  </div>
)
