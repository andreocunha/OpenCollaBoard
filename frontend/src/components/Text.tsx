import { socket } from "@/services/socket";
import React, { useState, useRef, useEffect } from "react";
import styles from "../styles/components/Text.module.css";

export function Text(props: any) {
  const [text, setText] = useState(props.data.data.text);
  const [squareHeight, setSquareHeight] = useState(100);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if(!isTyping){
      setText(props.data.data.text);
    }
  }, [props.data.data.text])

  function handleTextareaInput() {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    setSquareHeight(textarea.scrollHeight);
  }

  function handleTextareaFocus() {
    setIsFocused(!isFocused);
  }
  

  function handleTextChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(event.target.value);
    setIsTyping(true);
    if(typingTimeoutRef.current !== null) {
      clearInterval(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 500);

    socket.emit('nodeEvent', {
      id: props.data.id,
      type: props.data.type,
      position: {
        x: props.data.xPos,
        y: props.data.yPos
      },
      data: {
        text: event.target.value,
        fontSize: props.data.data.fontSize || '20px',
      },
      zIndex: props.data.zIndex
    });    
  }

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
      
      textarea.style.width = "auto";
      textarea.style.width = `${textarea.scrollWidth}px`;
      setSquareHeight(textarea.scrollHeight);
    }
  }, [text])

  return (
    <div className={styles.square} 
      style={{ 
        height: `${squareHeight+40}px`, 
        border: isFocused ? '1px solid #ccc' : 'none',
      }}
      onClick={handleTextareaFocus}
    >
      <textarea
        ref={textareaRef}
        className={styles.textarea}
        value={text}
        onChange={handleTextChange}
        onInput={handleTextareaInput}
        style={{
          fontSize: props.data.data.fontSize || '20px',
        }}
      />
    </div>
  );
}
