'use client';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Link } from '@/types/link';
import { LinkItem } from './LinkItem';

interface LinkListProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (link: Link) => void;
  onReorder: (newLinks: Link[]) => void; // Fungsi untuk lapor ke DashboardClient
}

export default function LinkList({ links, onEdit, onDelete, onReorder }: LinkListProps) {
  // Fungsi ini dipanggil saat user melepas geseran (drop)
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // Jika dilepas di luar area, abaikan

    const items = Array.from(links);
    // Hapus item dari posisi lama, lalu masukkan ke posisi baru
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Kirim urutan baru ke parent (DashboardClient)
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="links-list">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {links.map((link, index) => (
              <Draggable key={link.id.toString()} draggableId={link.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps} // Ini yang bikin area bisa ditarik
                  >
                    <LinkItem link={link} onEdit={onEdit} onDelete={onDelete} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
