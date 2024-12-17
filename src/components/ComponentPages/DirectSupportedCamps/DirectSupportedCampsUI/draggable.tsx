// Draggable TSX

import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  useSensor,
  useSensors,
  TouchSensor,
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
import { MenuOutlined } from "@ant-design/icons";
// import { getProperties } from "src/utils/generalUtility";
// import ReasonsActivity from "components/common/SupportReasonActivity";

export default function Draggable({
  tags,
  record,
  updateTagsOrder,
  onClose,
  setReOrderedTags,
  setActiveTopic = null,
}: any) {
  const sensors = useSensors(
    useSensor(TouchSensor, { activationConstraint: { distance: 10 } }),
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
        <SortableContext items={tags} strategy={verticalListSortingStrategy}>
          {tags?.map((item, index) => (
            <SortableItem
              key={item?.id}
              id={item?.id}
              item={item}
              index={index}
              onClose={onClose}
              record={record}
              updateTagsOrder={updateTagsOrder}
              setReOrderedTags={setReOrderedTags}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = tags?.findIndex((i) => i?.id === active?.id);
      const newIndex = tags?.findIndex((i) => i?.id === over?.id);

      updateTagsOrder(
        record.topic_num,
        record,
        arrayMove(tags, oldIndex, newIndex)
      );

      setReOrderedTags(arrayMove(tags, oldIndex, newIndex));
      setActiveTopic && setActiveTopic(record);

      return arrayMove(tags, oldIndex, newIndex);
    }
  }
}

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: props?.item?.dis ? "not-allowed" : "pointer",
    touchAction: "none",
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
          <MenuOutlined className="text-sm text-[#777F93]" />
          <Tag
            className="rounded-full mr-0 bg-[#dadbde] flex items-center  border-transparent font-medium text-sm px-3 py-1 leading-none text-canBlack"
            closable={true}
            closeIcon={
              <>
                <Image
                  preview={false}
                  src="/images/minus-user-icon.svg"
                  width={20}
                  height={20}
                  style={{ cursor: "not-allowed", alignSelf: "center" }}
                  alt=""
                />
                {/* {props?.item?.recent_activity
                  ? getProperties(props?.item?.recent_activity)?.reason && (
                      <Tooltip
                        title={
                          <div className="w-full">
                            <ReasonsActivity
                              CurrentItem={props?.item?.recent_activity}
                            />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                      >
                        <i className="icon-info text-xl ml-2 mr-1"></i>
                      </Tooltip>
                    )
                  : null} */}
              </>
            }
            onClose={(evt) => {
              // evt.preventDefault();
              // props?.onClose(props?.item)
            }}
          >
            {`${props?.index + 1}-${
              props?.item?.camp_name?.length > 30
                ? props.item.camp_name.substring(0, 30) + "..."
                : props.item.camp_name
            }`}
          </Tag>
        </>
      ) : (
        <>
          <MenuOutlined className="text-sm text-[#777F93]" />
          <Tag
            className="rounded-full mr-0 bg-[#F0F2FA] flex items-center border-transparent font-medium text-sm px-3 py-1 leading-none cn-card-home"
            closable={true}
            closeIcon={
              <>
                <Image
                  className="cursor-pointer"
                  preview={false}
                  src="/images/minus-user-icon.svg"
                  style={{ cursor: "pointer", alignSelf: "center" }}
                  width={20}
                  height={20}
                  alt=""
                />
                {/* {props?.item?.recent_activity
                  ? getProperties(props?.item?.recent_activity)?.reason && (
                      <Tooltip
                        title={
                          <div className="w-full">
                            <ReasonsActivity
                              CurrentItem={props?.item?.recent_activity}
                            />
                          </div>
                        }
                        placement="top"
                        className="pointer text-canGrey2"
                      >
                        <i className="icon-info text-xl ml-3"></i>
                      </Tooltip>
                    )
                  : null} */}
              </>
            }
            onClose={(evt) => {
              evt.preventDefault();
              evt.stopPropagation();
              props?.onClose(props?.item);
            }}
          >
            <a
              data-testid="styles_Bluecolor "
              className="text-sm font-medium flex items-center gap-2.5"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = props?.item?.camp_link;
              }}
            >
              {`${props?.index + 1}-${
                props?.item?.camp_name?.length > 30
                  ? props.item.camp_name.substring(0, 30) + "..."
                  : props.item.camp_name
              }`}
            </a>
          </Tag>
        </>
      )}
    </div>
  );
}
