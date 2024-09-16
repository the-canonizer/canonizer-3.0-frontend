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
import { MenuOutlined } from "@ant-design/icons";
import { Tag } from "antd";

export default function Draggable({
  tagsArrayList,
  setTagsArrayList,
  enableDisableTagsHandler,
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="vertical-chips">
      <DndContext
        sensors={sensors}
        modifiers={[restrictToVerticalAxis]}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tagsArrayList}
          strategy={verticalListSortingStrategy}
        >
          {tagsArrayList?.map((item, index) => (
            <SortableItem
              key={item?.id}
              id={item?.id}
              item={item}
              enableDisableTagsHandler={enableDisableTagsHandler}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setTagsArrayList((prev) => {
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
      {props?.item?.disabled ? (
          <Tag
            className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
            closable={true}
            onClose={(evt) => {
              evt.stopPropagation()
              console.info("close");
              props.enableDisableTagsHandler(props.item);
            }}
          >
            {props?.item?.id}-{props?.item?.content}
          </Tag>
      ) : (
        <>
          <MenuOutlined className="text-sm text-[#777F93]" />
          <Tag
            className="rounded-full mr-0 bg-[#F0F2FA] border-transparent font-semibold text-base px-5 py-2.5 leading-none text-canBlack"
            closable={true}
            onClose={(evt) => {
              evt.stopPropagation()

              console.info("close");
              props.enableDisableTagsHandler(props.item);
            }}
          >
            <a
              data-testid="styles_Bluecolor"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = props?.item?.link;
              }}
            >
              {props?.item?.id}-{props?.item?.content}
            </a>
          </Tag>
        </>
      )}
    </div>
  );
}
