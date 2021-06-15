import React, {Fragment} from "react";

const bio = () => {
  return (
    <Fragment>
      I'm a Software Developer and a Computing Student at Imperial College London. My topics of primary
      interest in Computing are Machine Learning, NLP, Computer Vision, Optimization, and Computational Finance.
      In my idle time, I enjoy creating and designing games and webapps, as well as reading about business,
      economics and politics to broaden my perspectives.
    </Fragment>
  );
}

const hobbies = () => {
  return (
    <Fragment>
      In my free time I tend to indulge myself in a range of different hobbies. I enjoy reading, investing, card games,
      playing the guitar, listening to podcasts, and binge watching the occasional Netflix show.
      I enjoy reading non-fiction genres - biographies, informative books, and I try to engage myself in books
      that can impact my day to day life.
      I am also a huge fan of 20th century rock music and pretty much always listening to the
      Rolling Stones, Fleetwood Mac, Led Zeppelin or the Chili Peppers.
    </Fragment>
  )
}

const Personal = {
  bio: bio(),
  hobbies: hobbies()
}

export default Personal;