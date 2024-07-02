import './home.css';
import React, { useEffect, useState } from 'react';
import Tippy from '@tippyjs/react/headless';
import axios from "../../config/axios";
import useDebounce from '../../hooks/useDebounce';
import TippyReact from '../../components/Tippy/tippy';
import Logout from '../../components/Logout/logout';

const Home = () => {
    const [showTippy, setShowTippy] = useState(false);
    const [keyword, setKeyword] = useState("");

    const [data, setData] = useState(null);

    let debouncedValue = useDebounce(keyword, 500);

    useEffect(() => {
        findPDF();
    }, [debouncedValue]);

    const findPDF = async () => {
        debouncedValue = debouncedValue.replace(/[^A-Za-zÀ-ỹ\s\d]/g, '').trim()
        if (debouncedValue) {
            debouncedValue = decodeURIComponent(debouncedValue);
            const res = await axios.post(`findpdf`,{keyword:debouncedValue});
            if (res && res.DT) {
                setData(res.DT);
            }
            setShowTippy(true);
        }
        else {
            setData([]);
            setShowTippy(false);
        }
    }

    const onChangeKeyWord = async (e) => {
        const keyword = (e.target.value);
        setKeyword(keyword);
    }



    return (
        <div>
            <Logout />
            <Tippy
                interactive={true}
                visible={showTippy}
                placement="bottom"
                render={attrs => (
                    <div className="box" tabIndex="-1" {...attrs}>
                        <TippyReact data={data} />
                    </div>
                )}
                onClickOutside={() => setShowTippy(false)}
            >
                <div className='container d-flex  align-items-center flex-column home'>
                    <input type="text" className="form-control col-12" id="search" placeholder="Search"
                        onFocus={() => setShowTippy(true)}
                        value={keyword}
                        onChange={(e) => onChangeKeyWord(e)}
                    />
                </div>
            </Tippy>
        </div>

    )
}

export default Home;