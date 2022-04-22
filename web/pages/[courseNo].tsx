import { Box, CircularProgress, CSSReset, Grid, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout'
import { Course, CourseCard, Professor, Sections } from '../components/CourseCard';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import { RecommendationCard } from '../components/RecCard';

const IndexPage = () => {
  const rout = useRouter();
  const { courseNo } = rout.query;
  const course = String(courseNo);
  const [data, setData] = useState<any>();
  const [recs, setRecs] = useState<any>();
  const [recfeedbackURL, setRecFeedbackURL] = useState('');

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/courses/')
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [course]);

  useEffect(() => {
    const fetchStuff = async () => {
      await fetch('/api/recommendations/' + recfeedbackURL)
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else {
            throw new Error('Failed');
          }
        })
        .then((data) => {
          console.log(data);
          setRecs(data);
          if (data.Error) {
            window.alert('Sorry! your session has expired. Please search for a valid course on the homepage');
            window.location.href = '/'
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStuff();
  }, [recfeedbackURL]);

  const courseCards: Array<Course> = [];
  
  if (data) {

    if (!data[course]) {
      window.alert('Error: Sorry this course does not exist in our system. Please search for a valid course on the homepage');
      window.location.href = '/'
    }

    const sections: Array<Sections> = [];

    for(let i = 0; i < data[course].sections.length; ++i) {
      const prof: Professor = {
        name: data[course].sections[i].class['Prof Name'],
        A: data[course].sections[i].prof['A'],
        B: data[course].sections[i].prof['B'],
        C: data[course].sections[i].prof['C'],
        D: data[course].sections[i].prof['D'],
        F: data[course].sections[i].prof['F'],
        Q: data[course].sections[i].prof['Q']
      }

      sections.push({
        capacity: Number(data[course].sections[i].class['Max Capacity']),
        actual: Number(data[course].sections[i].class['Current Enrollment']),
        section: Number(data[course].sections[i].class['Course Section']),
        days: data[course].sections[i].class['Class Timing'].DaysOfWeek,
        start: data[course].sections[i].class['Class Timing'].BeginTime,
        stop: data[course].sections[i].class['Class Timing'].EndTime,
        professor: prof
      });
    }

    courseCards.push({
      course: course,
      courseName: data[course].info['Course Name'],
      courseDescription: data[course].info['Course Description'],
      sections: sections,
      credit: Number(data[course].info['Course Credit Hours (u)'])
    });
    // console.log(data['CSCE 110']);
  }

  const recCards: Array<Course> = [];

  if (recs && data) {
    for (let i = 0; i < 4; ++i) {
      const temp = recs.at(i);

      const sections: Array<Sections> = [];
      // console.log(data);
      // console.log(course);
      // console.log(temp);
      // console.log(data[temp]);
      for(let i = 0; i < data[temp].sections.length; ++i) {
        const prof: Professor = {
          name: data[temp].sections[i].class['Prof Name'],
          A: data[temp].sections[i].prof['A'],
          B: data[temp].sections[i].prof['B'],
          C: data[temp].sections[i].prof['C'],
          D: data[temp].sections[i].prof['D'],
          F: data[temp].sections[i].prof['F'],
          Q: data[temp].sections[i].prof['Q']
        }

        sections.push({
          capacity: Number(data[temp].sections[i].class['Max Capacity']),
          actual: Number(data[temp].sections[i].class['Current Enrollment']),
          section: Number(data[temp].sections[i].class['Course Section']),
          days: data[temp].sections[i].class['Class Timing'].DaysOfWeek,
          start: data[temp].sections[i].class['Class Timing'].BeginTime,
          stop: data[temp].sections[i].class['Class Timing'].EndTime,
          professor: prof
        });
      }

      recCards.push({
        course: temp,
        courseName: data[temp].info['Course Name'],
        courseDescription: data[temp].info['Course Description'],
        sections: sections,
        credit: Number(data[temp].info['Course Credit Hours (u)'])
      });
    }
  }

  //console.log(recCards.length);

  function getRecs(feedbackURL: string) {
    setRecFeedbackURL(feedbackURL);
  }
  
  return (
    <Layout>
      <CSSReset />
      <Box minH={'100vh'} overflow="hidden">
        <Box p={4} align='center'>
          { data ?
            <CourseCard
              key={1}
              course={courseCards.at(0).course}
              courseName={courseCards.at(0).courseName}
              courseDescription={courseCards.at(0).courseDescription}
              sections={courseCards.at(0).sections}
              credit={courseCards.at(0).credit}
            /> :
            <CircularProgress isIndeterminate  size="100px" />
          }
        </Box>
        <Text p={4} fontSize='3xl' ><b>Recommended Similar Courses...</b></Text>
        <Box p={4}>
          { data ?
            <Grid templateColumns="repeat(4, 1fr)" gap={6}>
              {recCards.map((rec) => (
                <RecommendationCard
                  key={rec.course + '_key'}
                  course={rec.course}
                  courseName={rec.courseName}
                  courseDescription={rec.courseDescription}
                  sections={rec.sections}
                  credit={rec.credit}
                  feedback={getRecs}
                />
              ))}
            </Grid> :
            <CircularProgress isIndeterminate  size="100px" />
          }
        </Box>
      </Box>
    </Layout>
  );
};



export default IndexPage;