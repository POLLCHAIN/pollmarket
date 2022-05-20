/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/accessible-emoji */
import React , {useState,useEffect} from "react";

function HotNft(props) {

    const {item } = props;    
    const [auctionStatus, setAuctionStatus] = useState(false)
    const [state, setState] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

    useEffect(() => {
        if (item?.auctionInfo) setInterval(() => setNewTime(), 1000);
    }, [item]);

    const setNewTime = () => {
        const currentTimestamp = new Date().getTime()
        let countdownDate = 0;
        if(item.auctionInfo.startTime * 1000 > currentTimestamp) {            
            setAuctionStatus(false)
        } else if(item.auctionInfo.endTime * 1000 > currentTimestamp) {
            setAuctionStatus(true)
            countdownDate = item.auctionInfo.endTime * 1000;           
        } else {            
            setAuctionStatus(false)
        }
    
        if (countdownDate) {
          const distanceToDate = countdownDate - currentTimestamp;
    
          let days = Math.floor(distanceToDate / (1000 * 60 * 60 * 24));
          let hours = Math.floor(
            (distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          let minutes = Math.floor(
            (distanceToDate % (1000 * 60 * 60)) / (1000 * 60)
          );
          let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
    
          const numbersToAddZeroTo = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    
          if (numbersToAddZeroTo.includes(days)) {
            days = `0${days}`;
          } 
          if (numbersToAddZeroTo.includes(hours)) {
            hours = `0${hours}`;
          } 
          if (numbersToAddZeroTo.includes(minutes)) {
            minutes = `0${minutes}`;
          } 
          if (numbersToAddZeroTo.includes(seconds)) {
            seconds = `0${seconds}`;
          }
    
          setState({ days: days, hours: hours,  minutes: minutes, seconds: seconds });
        }
    };

    function goDetail() {
        props.history.push(`/detail/${item.itemCollection}/${item.tokenId}`);
    }
    

    return(
        <div className="item-box">
            <div onClick={() => goDetail()}>
                <div className="sliderCard">
                    <div className="cardImg">
                        <div className="img-box">
                            <img src={item.image} alt="SliderImage1" />
                        </div>
                        <div className="content-box">
                            <div className="leftBox">
                                <span className="heading">{item.name}</span>
                                <span className="tag">{item.creatorUser?.name}</span>
                            </div>
                            <div className="rightBox">
                            {
                                auctionStatus ?             
                                    <div className="timer">
                                        <span>{state.days || '00'}</span>:
                                        <span>{state.hours || '00'}</span>:
                                        <span>{state.minutes || '00'}</span>:
                                        <span>{state.seconds || '00'}</span>
                                    </div>                                 
                                    :
                                    <div className="timer">
                                        <span style = {{background:'#00000000'}}></span>
                                        <span style = {{background:'#00000000'}}></span>
                                        <span style = {{background:'#00000000'}}></span>
                                        <span style = {{background:'#00000000'}}></span>
                                    </div>
                            }                                
                            </div>
                        </div>
                    </div>
                    <div className="cardContent">
                        <p>{item.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HotNft;
