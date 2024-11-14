"use client";
import { FC, useState } from "react";
type Props = {
  children: string;
};

const TextExpander: FC<Props> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayText = isExpanded
    ? children
    : children.split(" ").slice(0, 40).join(" ") + "...";

  return (
    <span>
      {displayText}{" "}
      <button
        className="border-b border-primary-700 pb-1 leading-3 text-primary-700 hover:border-primary-500 hover:text-primary-500"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </span>
  );
};

export default TextExpander;
