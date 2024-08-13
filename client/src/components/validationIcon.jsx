import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const TooltipComponent = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <svg
            className="inline mb-[2px] mx-1"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <g fill="none">
              <path
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="4"
                d="M24 44a19.937 19.937 0 0 0 14.142-5.858A19.937 19.937 0 0 0 44 24a19.938 19.938 0 0 0-5.858-14.142A19.937 19.937 0 0 0 24 4A19.938 19.938 0 0 0 9.858 9.858A19.938 19.938 0 0 0 4 24a19.937 19.937 0 0 0 5.858 14.142A19.938 19.938 0 0 0 24 44Z"
              />
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M24 37a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5"
                clip-rule="evenodd"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M24 12v16"
              />
            </g>
          </svg>
        </TooltipTrigger>
        <TooltipContent className="zindex text-xs bg-red-600 text-white">
          <p className="text-xs">Required</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
