import {ExploreTopBooks} from "./component/ExploreTopBooks";
import {Carousel} from "./component/Carousel";
import {Heros} from "./component/Heros";
import {LibraryServices} from "./component/LibraryServices";
import React from "react";

export const HomePage=()=>{
    return(
        <>
            <ExploreTopBooks/>
            <Carousel/>
            <Heros/>
            <LibraryServices/>
        </>
    )
}