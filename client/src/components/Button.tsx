import React, { useState } from "react";
import styled from "styled-components";
import Block from "./Block";

type StyledProps = {
  primary?: boolean;
  selected?: boolean;
  small?: boolean;
  flatten?: boolean;
};

const StyledButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-right: -2px;
  transform: translateX(8px);
`;

const Content = styled.div`
  color: ${(props: StyledProps) =>
    props.selected ? "var(--bg)" : "var(--main)"};
  padding: ${(props: StyledProps) =>
    props.small ? "7px 12px" : props.primary ? "18px 34px" : "13px 27px"};
  font-size: ${(props: StyledProps) => (props.primary ? "18px" : "15px")};
  position: relative;
  transform: ${(props: StyledProps) =>
    props.flatten
      ? props.small
        ? "translate(-2px, -3px)"
        : "translate(-3px, -3px)"
      : "translate(0,0)"};
  transition: transform 0.3s;
`;

type Props = {
  primary?: boolean;
  selected?: boolean;
  small?: boolean;
  text: string;
  click: () => void;
};

const Button = (props: Props): JSX.Element => {
  const [down, setDown] = useState(false);

  return (
    <StyledButton
      onClick={() => props.click()}
      onMouseDown={() => setDown(true)}
      onMouseUp={() => setDown(false)}
      onMouseLeave={() => setDown(false)}
    >
      <Block pressed={props.selected} flatten={down} />
      <Content
        primary={props.primary}
        small={props.small}
        selected={props.selected}
        flatten={down}
      >
        {props.text}
      </Content>
    </StyledButton>
  );
};

export default Button;