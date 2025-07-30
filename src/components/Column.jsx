import Card from "./Card";
import { useContext } from "react";
import { DataContext } from "@/DataContext";
import { produce } from "immer";

/**
 *
 * @param {Object} props
 * @param {string} props.title
 * @param {Array} props.tasks
 * @param {Object} props.tasks.id
 * @param {string} props.tasks.title
 * @param {string} props.tasks.description
 * @returns {JSX.Element}
 */
const Column = ({ id, title, tasks = [], columnIndex }) => {
  const { data, setData, selectedBoardIndex } = useContext(DataContext);

  const createNewTaskObject = () => ({
    id: Date.now(),
    title: "New Task",
  });
  const createNewColumn = (dataArray, boardIndex, newTask) => {
    return dataArray[boardIndex].columns.map((column) => {
      if (column.id === id) {
        const taskslist = column?.tasks ?? [];
        return {
          ...column,
          tasks: [...taskslist, newTask],
        };
      }
      return column;
    });
  };

  const addNewTaskHandler = () => {
    const newTask = createNewTaskObject();
    const newColumns = createNewColumn(data, selectedBoardIndex, newTask);
    setData((prev) => {
      return produce(prev, (draft) => {
        draft[selectedBoardIndex].columns = newColumns;
      });

      // const newData = [...prev];
      // newData[selectedBoardIndex] = {
      //   ...newData[selectedBoardIndex],
      //   columns: newColumns,
      // };
      // return newData;
    });
  };
  const onDeleteHandler = () => {
    if (
      window.confirm(
        `Are you sure you want to delete this column? : "${title}"`,
      )
    ) {
      setData((prev) => {
        return produce(prev, (draft) => {
          draft[selectedBoardIndex].columns = draft[
            selectedBoardIndex
          ].columns.filter((column) => column.id !== id);
        });
      });
    }
  };

  return (
    <div className="flex w-72 shrink-0 flex-col self-start rounded-lg bg-lines-light px-2 shadow">
      <h2 className="group/column relative top-0 rounded bg-lines-light px-2 py-4 text-heading-s">
        {title}
        <button
          className="absolute bottom-0 right-0 top-0 p-2 text-body-m text-red opacity-0 duration-300 focus:opacity-100 group-hover/column:opacity-100"
          onClick={onDeleteHandler}
        >
          Delete
        </button>
      </h2>
      <div className="mb-5 flex flex-col gap-5">
        {tasks.map((task, index) => (
          <Card
            key={task.id}
            title={task.title}
            cardId={task.id}
            columnId={id}
            cardIndex={index}
            columnIndex={columnIndex}
          />
        ))}
      </div>
      <button
        className="-mx-2 mt-auto border-t border-light-grey bg-lines-light px-2 py-4 text-heading-m text-medium-grey"
        onClick={addNewTaskHandler}
      >
        + Add new Task
      </button>
    </div>
  );
};

export default Column;
