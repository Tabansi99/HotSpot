import { collection, getDocs } from 'firebase/firestore';
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '../../../../firebase/clientApp';

const handler = async (req: NextApiRequest , res: NextApiResponse) => {
  const { course } = req.query;
  const courseDB = collection(db, 'Courses');
  const coursesSnapShot = await getDocs(courseDB);
  const courseMap = new Map<any, any>();
  
  const sectionsDB = collection(db, 'Semester/Fall 2022/SemesterCourseOfferings');
  const sectionsSnapShot = await getDocs(sectionsDB);
  const sectionMap = new Map<any, any>();

  const professorsDB = collection(db, 'Professors');
  const professorsSnapShot = await getDocs(professorsDB);
  const professorsMap = new Map<any, any>();

  professorsSnapShot.forEach((prof) => {
    professorsMap.set(prof.id, prof.data());
  });
  
  sectionsSnapShot.forEach((course) => {
    sectionMap.set(course.id, course.data());
  });

  coursesSnapShot.forEach((course) => {
    const sects = new Array();
    
    for (var key in sectionMap.get(course.id)) {
      sects.push({
        class: sectionMap.get(course.id)[key],
        prof: professorsMap.get(sectionMap.get(course.id)[key]['Prof Name'])[course.id]
      });
    }
    
    courseMap.set(course.id, {
      info: course.data(),
      sections: sects
    });
  });

  const courses = Object.fromEntries(courseMap);
  const response = courses[String(course)];

  if (response) {
    res.send(response);
  }
  else {
    res.send({
      exists: false,
    });
  }
  
}

export default handler;