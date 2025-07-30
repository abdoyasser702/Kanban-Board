import clsx from "clsx";
import { useState, useContext } from "react";
import DialogDemo from "./DialogDemo";
import iconBoard from "@assets/icon-board.svg";
import { DataContext } from "@/DataContext";
import AddNewBoard from "./AddNewBoard";

/**
 *
 * @param {Object} props
 * @param {number} props.selectedBoardIndex
 * @param {Function} props.setSelectedBoardIndex
 * @returns {JSX.Element}
 */

const SideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data, selectedBoardIndex, setSelectedBoardIndex } =
    useContext(DataContext);
  return (
    <aside className="side-menu -mt-px w-[300px] border-r border-lines-light bg-white">
      <p className="px-8 py-4 text-heading-s">ALL BOARDS ({data.length})</p>
      <ul>
        {data.map((item, index) => (
          <li key={item.id}>
            <button
              className={clsx(
                "flex w-11/12 items-center gap-4 rounded-e-full px-8 py-4 text-heading-m text-medium-grey transition data-[isactive=false]:hover:bg-main-purple/10 data-[isactive=false]:hover:text-main-purple",
                {
                  "bg-main-purple !text-white hover:bg-main-purple":
                    selectedBoardIndex === index,
                },
              )}
              data-isactive={selectedBoardIndex === index}
              onClick={() => setSelectedBoardIndex(index)}
            >
              <img src={iconBoard} alt="Icon Board" />
              {item.title}
            </button>
          </li>
        ))}
        <li className="px-8 py-4">
          <DialogDemo
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            title="Create New Board"
            triggerComponent={
              <button className="flex w-full items-center gap-4 text-heading-m text-main-purple">
                <img src={iconBoard} alt="Icon Board" /> + Create New Board
              </button>
            }
          >
            <AddNewBoard toggleDialog={setIsOpen}></AddNewBoard>
          </DialogDemo>
        </li>
      </ul>
    </aside>
  );
};

export default SideMenu;
