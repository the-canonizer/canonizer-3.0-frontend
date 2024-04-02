import { Dropdown } from "antd";
import type { MenuProps } from 'antd';
import Image from "next/image";
import SortActiveTopicIcon from "../../../assets/image/sort-active-ico.svg";
import SortTopicIcon from "../../../assets/image/sort-ico.svg";
import styles from "../../ComponentPages/SortingTopics/sort.module.scss";
import { setScoreViewTopic, setSortLatestTopic } from "src/store/slices/utilsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store";
import { useRouter } from "next/router";
import { useEffect } from "react";



const SortTopics =()=>{
    const { sortLatestTopic,sortScoreViewTopic } = useSelector(
        (state: RootState) => ({
            sortLatestTopic: state?.utils?.sortLatestTopic,
            sortScoreViewTopic: state?.utils?.sortScoreViewTopic,
        })
      );
      const router = useRouter()


      useEffect(()=>{
        if(router.pathname == "/"){
            dispatch(setScoreViewTopic(false));
            dispatch(setSortLatestTopic(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      },[])
    const dispatch = useDispatch()
      const onLatestTopic = () => {
        dispatch(setSortLatestTopic(true));
        dispatch(setScoreViewTopic(false));
      };
      const onScoreViewTopic = () => {
        dispatch(setScoreViewTopic(true));
        dispatch(setSortLatestTopic(false));
      };
    const items: MenuProps['items'] = [
        {
          key: '1',
          label: (
            <a onClick={onLatestTopic}>
                <div >
                    Latest
                </div>  
                </a>          
          ),
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: (
              <a onClick={onScoreViewTopic}>
                <div>
                    Score Value
                </div>
                </a>
            ),
          },
      ];
      
     return (
        <Dropdown menu={{ items }} trigger={['click']}>
          <a onClick={(e) => e.preventDefault()} className={styles.sort_topic}>
            <span>
              {sortLatestTopic?"Latest":sortScoreViewTopic? "Score Value":"Sort"}
            <Image
             width={20}
             height={20}
             alt="sort"
             src={sortLatestTopic ||sortScoreViewTopic?SortActiveTopicIcon:SortTopicIcon}
             />
             </span>
          </a>
        </Dropdown>
      );
}

export default SortTopics;