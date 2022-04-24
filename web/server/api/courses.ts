import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/clientApp';
import { Router } from 'express';
import bodyParser from 'body-parser';

export const courses = Router();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
// console.log('Entered');
courses.post('/', urlencodedParser, async (req, res) => {
  const { major, course, tags, prevClasses } = req.body;
  console.log(req.body);
  // console.log(major);
  // console.log(course);
  // console.log(tags);
  // console.log(prevClasses);

  req.session.class = course;
  req.session.major = major;
  
  if (tags == '') {
    req.session.tags = [];
  }
  else if (!Array.isArray(tags)) {
    req.session.tags = [ tags ];
  }
  else {
    req.session.tags = tags;
  }

  if (prevClasses == '') {
    req.session.prevClasses = [];
  }
  else if (!Array.isArray(prevClasses)) {
    req.session.prevClasses = [ prevClasses ];
  }
  else {
    req.session.prevClasses = prevClasses;
  }

  req.session.neg = [];
  req.session.pos = [];

  res.redirect(`/${course}`)
});

courses.get('/', async (_req , res) => {
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

  const course = Object.fromEntries(courseMap);

  res.send(course);
});

courses.get('/:course', async (req, res) => {
  const { course } = req.params;

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
});

courses.post('/search', urlencodedParser, async (req, res) => {
  const { course } = req.body;
  console.log(req.body);

  req.session.class = course;

  req.session.neg = [];
  req.session.pos = [];

  res.redirect(`/${course}`)
});

courses.post('/notification', urlencodedParser, async (req, res) => {
  // const { course } = req.body;
  console.log(req.body);
  return;
  // res.redirect(`/${course}`)
});