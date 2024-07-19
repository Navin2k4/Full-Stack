import { useMemo, useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
// Create shape based on the 2d array
// empty box dataval==1
// invisible box dataval==0
// Click on it change tht bg color
// deselect in the order of selection
// Need a proper data structure for the order of insertion
//  When deselection is happening we need to disable the interactiion

const Shape = ({ data }) => {
  // since we need the oreder of insertion and only we are storing the index we can go with set
  const [selected, setSelected] = useState(new Set());
  // Change the 2d Array into a 1D flat array
  // Eg : [[],[],[],[]] => [1,1,1,0,1,1]
  const boxes = useMemo(() => data.flat(Infinity), [data]);
  // cannot click diring the process of unloading
  const [isUnloading,setIsUnloading] = useState(false);
  // creatied a timer for the removenextkey but we havent remove it so using useRef
  const timerRef = useRef(null);

  const countOfVisible = useMemo(() => {
    return boxes.reduce((acc, box) => {
      if (box === 1) {
        acc += 1;
      }
      return acc;
    }, 0);
  }, [boxes]);

  const handleClick = (e) => {
    // capture the targe the event is hit
    const { target } = e;
    //index of the box and the status
    const index = target.getAttribute('data-index');
    const status = target.getAttribute('data-status');
    // validate dont work fot the hidden values
    if (index == null || status === 'hidden' || selected.has(index) || isUnloading ) {
      return;
    }

    setSelected((prev) => {
      return new Set(prev.add(index));
    });
  };

  const unload = () => {
    setIsUnloading(true);
    //remove boxex each in 500ms
    //["5","3","1"] ...
    const keys = Array.from(selected.keys());
    const removeNextKey = () =>{
      if(keys.length){
        const currentKey = keys.shift(); // 5
        setSelected((prev)=>{
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        })
        timerRef.current = setTimeout(removeNextKey,500);
      } else {
        setIsUnloading(false);
        clearTimeout(timerRef.current);
      }
    }
    timerRef.current = setTimeout(removeNextKey,100);

  }
  useEffect(() => {
    // selectedsize == count-visible boxex start deselecting
    if (selected.size >= countOfVisible) {
      // unloading part
      unload();
    }
  }, [selected]);

  return (
    <div
      className="boxes"
      // The handle click is used here but not for the seperate box is for optimisation (event deligation) evevnt bubbling reduce the memory usage
      onClick={handleClick}
    >
      {boxes.map((box, index) => {
        const status = box === 1 ? 'visible' : 'hidden';
        // ["1","2","3"].has(1) => false so converted to toString
        const isSelected = selected.has(index.toString());
        return (
          <div
            key={`${box}-${index}`}
            className={classnames('box', status, isSelected && 'selected')}
            data-index={index}
            data-status={status}
          />
        );
      })}
    </div>
  );
};

export default Shape;
