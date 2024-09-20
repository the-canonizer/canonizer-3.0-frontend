// Draggable TSX

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Image, Tag } from "antd";

export default function Draggable({ valData, setValData, onClose }: any) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="draggable-container">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={valData} strategy={verticalListSortingStrategy}>
          {valData?.map((item, index) => (
            <SortableItem
              key={item?.id}
              id={item?.id}
              item={item}
              index={index}
              onClose={onClose}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setValData((prev) => {
        const oldIndex = prev?.findIndex((i) => i?.id === active?.id);
        const newIndex = prev?.findIndex((i) => i?.id === over?.id);

        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  }
}

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "pointer",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center gap-7"
    >
      {props?.item?.dis ? (
        <>
          <Tag
            className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
            closable={true}
            closeIcon={
              <Image
                className="cursor-pointer"
                src="/images/minus-user-icon.svg"
                width={24}
                height={24}
                style={{ cursor: "pointer", alignSelf: "center" }}
                alt=""
              />
            }
            onClose={(evt) => {
              evt.preventDefault();
              props?.onClose();
            }}
          >
            {`${props?.index + 1}-${props?.item?.camp_name}`}
          </Tag>
        </>
      ) : (
        <>
          <Tag
            className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
            closable={true}
            closeIcon={
              <Image
                className="cursor-pointer"
                src="/images/minus-user-icon.svg"
                style={{ cursor: "pointer", alignSelf: "center" }}
                width={24}
                height={24}
                alt=""
              />
            }
            onClose={(evt) => {
              evt.preventDefault();
              props?.onClose();
            }}
          >
            <a
              data-testid="styles_Bluecolor "
              onClick={(e) => {
                e.preventDefault();
                window.location.href = props?.item?.camp_link;
              }}
            >
              {`${props?.index + 1}-${props?.item?.camp_name}`}
            </a>
          </Tag>
        </>
      )}
    </div>
  );
}
