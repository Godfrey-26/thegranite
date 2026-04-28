'use client'

import Link from 'next/link';
import Image from "next/image";
import Content from "./components_ui/content"
import TopStories from "./sectors/top-stories"
import BreakingNews from "./sectors/breaking-stories"
import Featured from "./sectors/featured-stories"



export default function Home() {

  return(
    <>
         <Content>
            {/*Breaking News*/}
            {<BreakingNews />}
            {/*Trending stories*/}
            {<TopStories />}
            {/*Featured*/}
            {<Featured />}
         </Content>  
    </>
    );
  
}
