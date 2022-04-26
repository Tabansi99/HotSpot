import yagmail
from typing import List
import random
import time
yag = yagmail.SMTP('jd650293@gmail.com', 'HotSpot123')

def send_signup_email(reciever_email: str, course_number: str, sections: List[str]):
    time.sleep(random.randint(30,60))
    if len(sections) > 0:
        sec_choice = random.choice(sections)
        ending = f' (section {sec_choice})'
    else:
        ending = ''

    content = ['Congratulations, your are successfully signed up for ' + course_number + ending]
    yag.send(reciever_email, 'Course Sign-Up Success', content)

def notify_me_email(reciever_email: str, course_number: str, sections: List[str]):
    if len(sections) == 0:
        ending = ' for any section.'
    else:
        sec_string = ', '.join(sections)
        ending = f' for section(s) {sec_string}.'

    content = ['You will be notified when ' + course_number + ' becomes available'+ending]
    yag.send(reciever_email, 'Course Availability Notification', content)




