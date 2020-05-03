import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import "./css/tailwind.generated.css";

// ***
// Application Component

const App = () => {
  // Set state
  const [yinYangValue, setYinYangValue] = React.useState("");
  const [yin, setYin] = React.useState([]);
  const [yang, setYang] = React.useState([]);
  const [showModalWelcome, setShowModalWelcome] = React.useState(true);

  // Set References
  const yinYangValueRef = React.useRef();
  const yinValueRef = React.useRef();
  const yangValueRef = React.useRef();

  // useEffect with Refs so we can access the values in handleKeyDown
  React.useEffect(() => {
    yinYangValueRef.current = yinYangValue;
    yinValueRef.current = yin;
    yangValueRef.current = yang;
  });

  // Mount EventListener handle KeyDown events with handleKeyDown()
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle '-' and '+' keys to add items
  // The code of the '+' key is 'Equal'
  const handleKeyDown = (e) => {
    const currentYinYangValue = yinYangValueRef.current;

    // If input is empty or keys are not '-' or '+'
    if (
      currentYinYangValue.length === 0 ||
      (e.code !== "Minus" && e.code !== "Equal")
    ) {
      return;
    } else {
      // Prevent that an '-' or '+' character gets added
      e.preventDefault();
    }

    // Add item to Equal, reset input and focus input field
    if (e.code === "Equal") {
      setYin([
        ...yinValueRef.current,
        {
          id: `item-${yinValueRef.current.length}`,
          content: currentYinYangValue,
        },
      ]);
      setYinYangValue("");
      document.getElementById("yin-yang-value").focus();
    }

    // Add item to Minus, reset input and focus input field
    if (e.code === "Minus") {
      setYang([
        ...yangValueRef.current,
        {
          id: `item-${yangValueRef.current.length}`,
          content: currentYinYangValue,
        },
      ]);
      setYinYangValue("");
      document.getElementById("yin-yang-value").focus();
    }
  };

  // Reorder a list, with startIndex as previous position and endIndex as new position
  const reorder = ({ list, startIndex, endIndex }) => {
    const result = Array.from(list);
    console.log(result);
    console.log(startIndex);
    console.log(endIndex);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result, listType) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    // Get yin or yang state based on list type
    const currentItems =
      listType === "list-yin"
        ? yinValueRef.current
        : listType === "list-yang"
        ? yangValueRef.current
        : [];

    // Generate reordered list
    const reorderedItems = reorder({
      list: currentItems,
      startIndex: result.source.index,
      endIndex: result.destination.index,
    });

    // Set new State
    if (listType === "list-yin") {
      setYin(reorderedItems);
    }

    if (listType === "list-yang") {
      setYang(reorderedItems);
    }
  };

  return (
    <div className="min-h-screen relative">
      {showModalWelcome ? (
        <ModalWelcome setShowModalWelcome={setShowModalWelcome} />
      ) : null}

      <div className="flex items-center justify-center pt-6">
        <span className="w-10 h-10">
          <ScaleIcon />
        </span>
      </div>

      <div className="w-full pb-20 p-6">
        {/* Input and Buttons */}
        <div>
          <input
            autocomplete="off"
            id="yin-yang-value"
            value={yinYangValue}
            onChange={(e) => setYinYangValue(e.target.value)}
            placeholder="Type here..."
            className="text-center w-full py-4 px-4 text-2xl mb-6"
          />

          {/* Add to Yin or Yang categorie */}
          <div className="flex">
            {/* Yin Button */}
            <button
              className="w-full text-white border-2 border-gray-900 mr-3 text-4xl p-1 mr- rounded bg-gray-900"
              onClick={() => {
                if (yinYangValue.length === 0) {
                  document.getElementById("yin-yang-value").focus();
                  return;
                }
                setYin([
                  ...yin,
                  {
                    id: `item-${yin.length}`,
                    content: yinYangValue,
                  },
                ]);
                setYinYangValue("");
                document.getElementById("yin-yang-value").focus();
              }}
            >
              <span className="w-6 h-6 inline-block">
                <YinIcon />
              </span>
            </button>

            {/* Yang Button */}
            <button
              className="w-full ml-3 text-4xl p-1 rounded
              bg-white text-gray-900 border-2 border-gray-900"
              onClick={() => {
                if (yinYangValue.length === 0) {
                  document.getElementById("yin-yang-value").focus();
                  return;
                }
                setYang([
                  ...yang,
                  {
                    id: `item-${yang.length}`,
                    content: yinYangValue,
                  },
                ]);
                setYinYangValue("");
                document.getElementById("yin-yang-value").focus();
              }}
            >
              <span className="w-6 h-6 inline-block">
                <YangIcon />
              </span>
            </button>
          </div>
        </div>

        {/* Container for Yin and Yang lists */}
        <div className="md:flex w-full py-6">
          {/* Yin List */}
          <div className="w-full md:mr-3">
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, "list-yin")}
            >
              <Droppable className="h-full" droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {yin.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer mt-0 hover:-mt-1 hover:mb-5 hover:shadow-lg mb-4 w-full inline-block bg-gray-900 border-2 border-gray-900 text-white px-4 py-3 rounded bg-white flex items-center justify-between
                            ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <span className="w-6 h-full relative -ml-1 mr-3 text-gray-500">
                              <VerticalDotsIcon />
                            </span>
                            <span className="text-lg md:text-2xl">
                              {item.content}
                            </span>
                            <span className="cursor-pointer text-gray-500 opacity-0 hover:opacity-100 hover:text-gray-900 w-10 p-2 h-full relative -ml-1">
                              {/* <TrashIcon /> */}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* Yang List */}
          <div className="w-full md:ml-3">
            <DragDropContext
              onDragEnd={(result) => onDragEnd(result, "list-yang")}
            >
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {yang.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`cursor-pointer mt-0 hover:-mt-1 hover:mb-5 hover:shadow-lg mb-4 w-full inline-block bg-white text-gray-900 border-2 border-gray-900 px-4 py-3 rounded bg-white flex items-center justify-between
                            ${snapshot.isDragging ? "shadow-lg" : ""}`}
                          >
                            <span className="w-6 h-full relative -ml-1 mr-3 text-gray-500">
                              <VerticalDotsIcon />
                            </span>
                            <span className="text-lg md:text-2xl">
                              {item.content}
                            </span>
                            <span className="cursor-pointer text-gray-500 opacity-0 hover:opacity-100 hover:text-gray-900 w-10 p-2 h-full relative -ml-1">
                              {/* <TrashIcon /> */}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-center w-full mb-5 text-lg text-center">
        <a
          className="mr-2 text-sm font-bold tracking-wide uppercase transition-transform duration-500 ease-in-out scale-100 hover:scale-110"
          href="https://twitter.com/aidenbuis"
          target="_blank"
          rel="noopener noreferrer"
        >
          (づ｡◕‿‿◕｡)づ ❤
          <br />
          @aidenbuis
        </a>
      </div>
    </div>
  );
};

const ModalWelcome = ({ setShowModalWelcome }) => {
  // Set state for navigation
  const [pageIndex, setPageIndex] = React.useState(0);
  const pages = ["Welcome", "Instructions"];

  // Functionality to use left and right arrows for navigation
  const pageIndexRef = React.useRef();

  // useEffect with Ref so we can access the value in handleKeyDown
  React.useEffect(() => {
    pageIndexRef.current = pageIndex;
  });

  // Mount EventListener handle KeyDown events with handleKeyDown()
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Handle left and right arrow keys to navigate
  const handleKeyDown = (e) => {
    const currentPageIndex = pageIndexRef.current;

    if (e.code !== "ArrowLeft" && e.code !== "ArrowRight") {
      return;
    }

    // Navigate left
    if (e.code === "ArrowLeft" && currentPageIndex !== 0) {
      setPageIndex(currentPageIndex - 1);
    }

    // Navigate right
    if (e.code === "ArrowRight" && currentPageIndex !== pages.length - 1) {
      setPageIndex(currentPageIndex + 1);
    }
  };

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-6 sm:inset-0 sm:p-0 sm:flex sm:items-center sm:justify-center z-20">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div className="bg-white rounded-lg px-4 pb-4 pt-0 overflow-hidden shadow-xl transform transition-all sm:max-w-sm sm:w-full sm:px-6 sm:pb-6">
        <div>
          <div className="w-full flex pt-2">
            {pages.map((item, index) => (
              <div
                onClick={() => {
                  if (index === pageIndex) return;
                  setPageIndex(index);
                }}
                key={index}
                className={`w-full py-3`}
              >
                <span
                  className={`h-1 w-full rounded-lg inline-block 
              ${index === 0 ? "" : "ml-2"}
              ${index === pageIndex ? "bg-gray-900" : "bg-gray-300"}
              `}
                ></span>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <span className="w-10 h-10 inline-block">
              <ScaleIcon />
            </span>
          </div>
          {pageIndex === 0 ? (
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                The Energy Balance Sheet
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-600 text-justify">
                  Become more conscious of your energy balance. What costs you
                  energy and what brings you energy? Think holistic: How does
                  your nutrition look, your sleeping hygiene, your movement, the
                  people around you, the work you do, your free time, et cetera.
                </p>
              </div>
            </div>
          ) : pageIndex === 1 ? (
            <div className="mt-3 text-center sm:mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Using the Energy Balance Sheet
              </h3>
              <div className="mt-2">
                <p className="text-sm leading-5 text-gray-600 text-justify">
                  The black column is what gives you energy (yin). The white
                  column is what costs energy (yang). Add items to the white
                  column using the moon button or by pressing the '-' key. Add
                  items to the black column using the sun button or by pressing
                  the '+' key. You can reorder the items by dragging them.
                </p>
              </div>
            </div>
          ) : null}
        </div>
        <div className="mt-5 sm:mt-6">
          <span className="flex w-full rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => {
                if (pageIndex === pages.length - 1) {
                  setShowModalWelcome(false);
                } else {
                  setPageIndex(pageIndex + 1);
                }
              }}
              className="w-full text-white border-2 border-gray-900 text-lg p-1 rounded bg-gray-900 uppercase tracking-wider"
            >
              {pageIndex === pages.length - 1 ? "Enter" : "Next"}
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

// ***
// Icon Components

const TrashIcon = () => (
  <svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
  </svg>
);

const ScaleIcon = () => (
  <svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
  </svg>
);

const YinIcon = () => (
  <svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
  </svg>
);

const YangIcon = () => (
  <svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const VerticalDotsIcon = () => (
  <svg
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
  </svg>
);

export default App;
