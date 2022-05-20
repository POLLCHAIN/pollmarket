import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as header from "./style";
import * as footer from "./style";

// community images
import TwitterIcon from "../../assets/images/icon-twitter.png";
import TelegramIcon from "../../assets/images/icon-telegram.png";
import MediumIcon from "../../assets/images/icon-medium.png";

export class Footer extends Component {
    render() {
        return (
            <footer.FiteFooter>
                <header.Container>

                    <div className="top-Box">                        
                        <div className="subscrib-Box">
                            <div className="inner-box">
                                <h6 style={{marginBottom:'10px'}}>NFT marketplace for PollChain</h6>                                
                            </div>
                        </div>
                        <div className="community-Box">
                            <h5>Community</h5>
                            <ul>
                                <li><a href={"https://mobile.twitter.com/pollchain"} target="_blank" rel="noreferrer"><img src={TwitterIcon} alt="Twitter" /></a></li>
                                {/* <li><a href={"https://discord.com/invite/qKCfj3SXSV"} target="_blank" rel="noreferrer"><img src={DiscordIcon} alt="Discord" /></a></li> */}
                                <li><a href={"https://t.me/pollchain"} target="_blank" rel="noreferrer"><img src={TelegramIcon} alt="Telegram" /></a></li>
                                <li><a href={"https://medium.com/@pollchain"} target="_blank" rel="noreferrer"><img src={MediumIcon} alt="Medium" /></a></li>
                                {/* <li><a href={"https://docs.sauna.finance/"} target="_blank" rel="noreferrer"><img src={DocsIcon} alt="Docs" /></a></li> */}
                                
                            </ul>
                        </div>
                    </div>
                    <div className="bottom-Box">
                        <div className="logoInfo-Box">                            
                            <p>Please contact us if you have any specific idea or request <Link to="/">admin@pollchain.co</Link> </p>
                        </div>
                        <div className="menulinks-Box">
                            {/* <div className="menulinks-1">
                                <h5>Marketplace</h5>
                                <ul>
                                    <li><Link to="/">Market </Link></li>                                    
                                </ul>
                            </div> */}
                            <div className="menulinks-3">
                                <h5>Service</h5>
                                <ul>
                                    <li>
                                        <a href={"https://www.lbank.info/exchange/poll/usdt"} target="_blank" rel="noreferrer">Buy POLL</a>
                                    </li>                                    
                                </ul>
                            </div>
                            {/* <div className="menulinks-3">
                                <h5>Support</h5>
                                <ul>
                                    <li><Link to="/how-it-work">How It Work </Link></li>                                    
                                </ul>
                            </div> */}
                        </div>
                    </div>                    
                </header.Container>
            </footer.FiteFooter>
        );
    }
}


