import DialogDemo from "./DialogDemo";
import DropdownPrimitive from "./DropdownPrimitive";
import iconverticalellipsis from "@assets/icon-vertical-ellipsis.svg";
import { useState, useContext } from "react";
import { DataContext } from "@/DataContext";
import AddNewBoard from "./AddNewBoard"; // Assuming this component exists for adding/editing boards
import { produce } from "immer";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, setData, selectedBoardIndex } = useContext(DataContext);

  const editHandler = () => setIsOpen(true);
  const deleteHandler = () => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      setData((prev) => {
        return produce(prev, (draft) => {
          draft.splice(selectedBoardIndex, 1);
        });
        // const newData = [...prev];
        // newData.splice(selectedBoardIndex, 1);
        // return newData;
      });
    }
  };

  return (
    <header className="flex h-[97px] shrink-0 items-center">
      <div className="flex w-[300px] items-center gap-4 self-stretch border-b border-r border-lines-light pl-8 text-[32px] font-bold">
        <h1>Kanban</h1>
      </div>
      <div className="flex flex-1 items-center justify-between self-stretch border-b border-lines-light pl-6 pr-6">
        <h2 className="text-heading-xl">Platform Launch</h2>
        <DropdownPrimitive
          items={{
            edit: {
              label: "Edit Board",
              onClick: editHandler,
            },
            delete: {
              label: "Delete board",
              onClick: deleteHandler,
            },
          }}
          triggerComponent={() => (
            <button>
              <img
                className="select-none"
                src={iconverticalellipsis}
                alt="Icon-Verticle-Ellipsis"
              />
            </button>
          )}
        />
        <DialogDemo isOpen={isOpen} setIsOpen={setIsOpen} title="Edit Board">
          <AddNewBoard
            toggleDialog={setIsOpen}
            boardId={data[selectedBoardIndex]?.id}
            columns={data[selectedBoardIndex]?.columns}
            title={data[selectedBoardIndex]?.title}
          ></AddNewBoard>
        </DialogDemo>
      </div>
    </header>
  );
};

export default Header;
