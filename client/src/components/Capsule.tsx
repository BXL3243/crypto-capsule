import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import dateformat from "dateformat";
import countdown from "countdown";
import { useSelector } from "react-redux";

import Button from "./Button";
import CapsuleType, { Asset } from "../types/CapsuleType";
import { openCapsule } from "../services/contracthelper";
import { selectTokens } from "../state/tokenSlice";
import Token from "../types/Token";
import Block from "./Block";

const StyledCapsule = styled.div`
  position: relative;
  width: 100%;
  margin: 2rem 0;
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  padding: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Image = styled.div`
  height: 80px;
  width: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  color: var(--main);
  text-transform: uppercase;
`;

const OpenImage = styled(Image)`
  background-color: pink;
`;

const ClosedImage = styled(Image)`
  background-color: lightgreen;
`;

const ReadyImage = styled(Image)`
  background-color: lightblue;
`;

const CountdownContainer = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 0 30px;
`;

const Countdown = styled.div`
  color: var(--main);
  font-size: 30px;
  font-weight: 500;
`;

const OpenDate = styled.div`
  color: var(--sub);
  font-size: 16px;
`;

const ValueContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  padding: 0 30px;
`;

const Dollars = styled.div`
  color: var(--main);
  font-size: 30px;
  font-weight: 500;
  text-align: right;
`;

const Crypto = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CyptoIconContainer = styled.div`
  width: 1.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CryptoIcon = styled.img`
  background-color: white;
  border-radius: 50%;
  width: 2rem;
`;

type Props = {
  capsule: CapsuleType;
};

const Capsule = (props: Props): JSX.Element => {
  const tokens = useSelector(selectTokens);

  const [now, setNow] = useState(new Date());
  const nowRef = useRef(now);
  nowRef.current = now;

  const tick = () => {
    setNow(
      new Date(nowRef.current.setSeconds(nowRef.current.getSeconds() + 1))
    );
  };

  useEffect(() => {
    setInterval(() => tick(), 1000);
  }, []);

  const open = async () => {
    await openCapsule(props.capsule.id);
    props.capsule.opened = true;
  };

  const isOpen =
    new Date(props.capsule.distributionDate).getTime() <
    nowRef.current.getTime();

  return (
    <StyledCapsule>
      <Block />
      <Content>
        {isOpen && props.capsule.opened && <OpenImage>asset 2</OpenImage>}
        {isOpen && !props.capsule.opened && <ReadyImage>asset 3</ReadyImage>}
        {!isOpen && <ClosedImage>asset 4</ClosedImage>}
        <CountdownContainer>
          <Countdown>
            {isOpen
              ? "0 hours, 0 minutes, 0 seconds"
              : countdown(
                  new Date(),
                  props.capsule.distributionDate,
                  countdown.MILLISECONDS,
                  3
                ).toString()}
          </Countdown>
          <OpenDate>
            {dateformat(props.capsule.distributionDate, "mm/dd/yyyy")}
          </OpenDate>
        </CountdownContainer>
        <ValueContainer>
          {/* TODO: Get usd */}
          <Dollars>{`$${Number(100).toFixed(2).toLocaleString()}`}</Dollars>
          <Crypto>
            {props.capsule.assets.map((asset: Asset) => (
              <CyptoIconContainer key={asset.token}>
                <CryptoIcon
                  src={
                    tokens.filter(
                      (token: Token) => token.address === asset.token
                    )[0].logoURI
                  }
                />
              </CyptoIconContainer>
            ))}
          </Crypto>
        </ValueContainer>
        {isOpen && !props.capsule.opened && (
          <Button primary text="Open" click={() => open()} />
        )}
        {!isOpen &&
          props.capsule.addingAssetsAllowed &&
          !props.capsule.opened && (
            <Button
              primary
              text="Add Assets"
              click={() => console.log("Meow")}
            />
          )}
      </Content>
    </StyledCapsule>
  );
};

export default Capsule;
