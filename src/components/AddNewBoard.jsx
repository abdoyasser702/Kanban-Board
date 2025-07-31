import Button from "./Button";
import TextField from "./TextField";
import iconCross from "@assets/icon-cross.svg";
import { useState, useContext } from "react";
import { DataContext } from "../DataContext";

const AddNewBoard = ({
  toggleDialog,
  boardId,
  columns = [{ id: Date.now() }],
  title,
}) => {
  const [columnsArray, setColumnsArray] = useState(columns);
  const { setData, setSelectedBoardIndex } = useContext(DataContext);

  const removeColumnHandler = (index) => () => {
    setColumnsArray((prev) => prev.filter((_, i) => i !== index));
  };
  const addColumnHandler = () => {
    setColumnsArray((prev) => [...prev, { id: Date.now() }]);
  };
  const createNewColumnsArray = (formData, columnsArray, boardId) => {
    return columnsArray.map((column) => {
      const taskArray = boardId ? column.tasks : []; // Initialize tasks as empty array if boardId is not provided
      return {
        id: column.id,
        title: formData.get(column.id), // Get the value from the form
        tasks: taskArray,
      };
    });
  };

  const updateDataState = (boardName, newColumnsArray, setData, boardId) => {
    setData((prev) => {
      const prevData = Array.isArray(prev) ? prev : [];
      let newData;

      if (boardId) {
        newData = prevData.map((item) => {
          if (item.id === boardId) {
            return {
              ...item,
              title: boardName,
              columns: newColumnsArray,
            };
          }
          return item;
        });
      } else {
        newData = [
          ...prevData,
          {
            id: Date.now(),
            title: boardName,
            columns: newColumnsArray,
          },
        ];
        setSelectedBoardIndex(prevData.length);
      }
      return newData;
    });
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const boardName = formData.get("boardName");
    const newColumnsArray = createNewColumnsArray(
      formData,
      columnsArray,
      boardId,
    );
    updateDataState(boardName, newColumnsArray, setData, boardId);
    toggleDialog(false); // Update the selected board index to the new board
  };
  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <h3 className="pb-2 pt-6 text-body-m text-medium-grey">Name</h3>
        <TextField
          placeholder="e.g. Web Design"
          name="boardName"
          defaultValue={title}
          required
        ></TextField>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="pt-6 text-body-m text-medium-grey">Columns</h3>
        {columnsArray.map((column, index) => (
          <div key={column.id} className="flex items-center gap-4">
            <TextField
              placeholder="e.g. TODO"
              name={column.id}
              defaultValue={column.title}
              required
            ></TextField>
            <button type="button" onClick={removeColumnHandler(index)}>
              <img src={iconCross} alt="Icon Cross" />
            </button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={addColumnHandler}
        >
          + Add New Column
        </Button>
      </div>
      <div className="mt-6">
        <Button type="submit" variant="primary" size="sm" isFullWidth>
          {boardId ? "Update Board" : "Create New Board"}
        </Button>
      </div>
    </form>
  );
};

export default AddNewBoard;
