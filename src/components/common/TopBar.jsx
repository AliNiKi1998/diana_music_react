import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
//actions
import { setMusic } from '../../state_manager/actions/song';
//sercives
import { getMonthPopularMusic, searchMusic } from '../../services/musicServises';
import config from './../../services/config.json'
import SearchItem from './SearchItem';
import { hideLoading, showLoading } from 'react-redux-loading-bar';

const TopBar = () => {

    const user = useSelector(state => state.user);

    const [musicSearch, setMusicSearch] = useState([]);

    const [monthMusic, setMonthMusic] = useState({});

    const dispatch = useDispatch();

    let showUser = "hidden";
    let showLogin = "";

    if (Object.keys(user).length !== 0) {
        showUser = ""
        showLogin = "hidden";
    }

    useEffect(() => {
        (async () => {
            await getMonthPopularMusic().then(
                resolved => {
                    const { status, data } = resolved;
                    if (status === 200) {
                        setMonthMusic(data);
                    }
                }
            )
        })();
    }, [])

    const handleSetMusic = () => {
        dispatch(setMusic(monthMusic));
    }

    const handleSearch = async (e) => {
        dispatch(showLoading());
        const SearchForm = new FormData();
        SearchForm.append('string', e.target.value)
        await searchMusic(SearchForm).then(
            resolved => {
                const { status, data } = resolved;
                if (status === 200) {
                    setMusicSearch(data);
                    dispatch(hideLoading());
                }
            }
        )
        if(isEmpty(e.target.value)){
            setMusicSearch([]);
        }
    }


    return (
        <Fragment>
            <div className="ms_header">
                <div className="ms_top_left">
                    <div className="ms_top_search">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="???????????? ????????"
                            onChange={e => handleSearch(e)}
                        />
                        <span className="search_icon">
                            <img
                                src="images/svg/search.svg"
                                alt="" />
                        </span>
                    </div>
                    {isEmpty(musicSearch) ? (null) : (
                        <div className="search_box">

                            {!isEmpty(musicSearch) ?
                                musicSearch.map((music, index) => (
                                    <SearchItem music={music} index={index} />
                                ))
                                : (<p>?????? ?????????? ???????? ??????</p>)}
                        </div>
                    )}
                </div>
                {!isEmpty(monthMusic) ?
                    <div className="ms_top_trend">
                        <span
                            className="ms_color"
                            onClick={() => handleSetMusic()}
                        >???????????? ???????? ?????? ?????????? :</span>
                        <span className="top_marquee">{monthMusic.name} </span>
                        <span className="top_marquee"> ????</span>
                        <span className="top_marquee"> {monthMusic.singerName}</span>
                    </div> : null
                }
                <div className="ms_top_right">
                    <div className="top_logo">
                        <Link
                            to="/"
                        >
                            <img src="images/logo.png" />
                        </Link>
                    </div>
                    <div className={`ms_top_btn ${showUser}`}>
                        <div className="ms_topbar_profile">
                            <span>
                                <i className="fa fa-caret-down ml-2"></i>
                                ???????? {`${user.first_name} ${user.last_name}`}

                            </span>
                            <div className="ms_topbar_profile_img">
                                <img src={`${config.nic_music}${user.avatar}`} alt="" />
                            </div>

                            <ul className="pro_dropdown_menu text-right">
                                <li>
                                    <Link to="/profile">??????????????</Link>
                                </li>
                                <li>
                                    <Link to="/play-lists">?????? ???????? ????</Link>
                                </li>
                                <li>
                                    <Link to="/logout">????????</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`ms_top_btn ${showLogin}`}>

                        <Link to="/register" className="ms_btn reg_btn">
                            <span>?????? ??????</span>
                        </Link>

                        <Link to="/login" className="ms_btn reg_btn">
                            <span>????????</span>
                        </Link>

                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default TopBar;