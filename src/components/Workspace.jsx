import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./Column";
import { useContext, useMemo } from "react";
import { DataContext } from "@/DataContext";
import { produce } from "immer";

const Workspace = () => {
  const { data, setData, selectedBoardIndex } = useContext(DataContext);
  const columns = data[selectedBoardIndex]?.columns;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  );
  const createNewColumn = (num) => ({
    id: Date.now(),
    title: `New Column ${num}`,
    tasks: [],
  });

  const addNewColumnHandler = () => {
    const num = data[selectedBoardIndex].columns.length;
    const newColumn = createNewColumn(num);

    setData((prev) => {
      return produce(prev, (draft) => {
        draft[selectedBoardIndex].columns.push(newColumn);
      });
      // const newData = [...prev];
      // newData[selectedBoardIndex] = {
      //   ...newData[selectedBoardIndex],
      //   columns: [...newData[selectedBoardIndex].columns, newColumn],
      // };
    });
  };
  const tasksIds = useMemo(() => {
    if (!columns || !Array.isArray(columns)) return [];

    return columns.reduce((acc, column) => {
      const taskList = Array.isArray(column?.tasks) ? column.tasks : [];
      return [...acc, ...taskList.map((task) => task?.id).filter(Boolean)];
    }, []);
  }, [columns]);

  const onDragEndHandler = (event) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over.id;
    const overColumnId = over.data.current?.columnId;
    const activeColumnId = active.data.current?.columnId;

    if (activeId === overId) return;
    if (!overColumnId || !activeColumnId) return;

    if (activeColumnId === overColumnId) {
      const newColumns = columns.map((column) => {
        if (column.id === activeColumnId) {
          const activeIdIndex = column.tasks.findIndex(
            (task) => task.id === activeId,
          );
          const overIdIndex = column.tasks.findIndex(
            (task) => task.id === overId,
          );
          const tasks = arrayMove(column.tasks, activeIdIndex, overIdIndex);

          return { ...column, tasks };
        }
        return column;
      });

      setData((prev) =>
        produce(prev, (draft) => {
          draft[selectedBoardIndex].columns = newColumns;
        }),
      );
    }
  };
  const onDragOverHandler = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;

    const overColumnId = over?.data?.current?.columnId;
    const activeColumnId = active?.data?.current?.columnId;

    if (!overColumnId || !activeColumnId) return;

    if (overColumnId && activeColumnId !== overColumnId) {
      const newColumns = columns.map((column) => {
        // if the column is the column that the card is dragged to then add the task to the column
        if (column.id === overColumnId) {
          // get the active task from the active column's tasks
          const activeTask = columns
            .find((column) => column.id === activeColumnId)
            .tasks.find((task) => task.id === activeId);
          // add the active task to the end of the new column's tasks because the dnd lib will handle the reordering
          const tasks = [...column.tasks, activeTask];

          return { ...column, tasks };
        }

        // if the column is the column that the card is dragged from then remove the task from the column
        if (column.id === activeColumnId) {
          const tasks = column.tasks.filter((task) => task.id !== activeId);

          return { ...column, tasks };
        }

        return column;
      });

      setData((prev) =>
        produce(prev, (draft) => {
          draft[selectedBoardIndex].columns = newColumns;
        }),
      );
    }
  };
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEndHandler}
      onDragOver={onDragOverHandler}
    >
      <div className="flex h-[calc(100vh-97px)] flex-1 gap-6 overflow-auto bg-light-grey p-6">
        <SortableContext
          items={tasksIds}
          strategy={verticalListSortingStrategy}
        >
          {columns?.length > 0 &&
            columns?.map((column, index) => (
              <Column
                key={column.id}
                id={column.id}
                title={column.title}
                tasks={column.tasks}
                columnIndex={index}
              />
            ))}
        </SortableContext>
        {data[selectedBoardIndex] && (
          <button
            className="w-72 shrink-0 self-start rounded-md bg-lines-light p-3 text-heading-l text-medium-grey"
            onClick={addNewColumnHandler}
          >
            + Add New Column
          </button>
        )}
      </div>
    </DndContext>
  );
};

export default Workspace;
