import yagmail
yag = yagmail.SMTP('jd650293@gmail.com', 'HotSpot123')

def send_signup_email(reciever_email: str, course_number: str):
    content = ['Congratulations, your are successfully signed up for ' + course_number]
    yag.send(reciever_email, 'Course Sign-Up Success', content)

def notify_me_email(reciever_email: str, course_number: str):
    content = ['You will be notified when ' + course_number + ' becomes available']
    yag.send(reciever_email, 'Course Availability Notification', content)


