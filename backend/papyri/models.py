import uuid
from django.db import models
from django.core.validators import RegexValidator, MaxValueValidator
from django.contrib.auth.models import User

# Create your models here.

class UserInfo(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE)

    uid = models.CharField(validators=[RegexValidator(r'^[0-9]{9}')], max_length=10, blank=True)
    
    is_student = models.BooleanField(default=True)

    def __str__(self):
        return self.owner.username

class ProfilePic(models.Model):
    owner = models.ForeignKey(UserInfo, on_delete=models.CASCADE, related_name='profile_pic')
    pic1 = models.ImageField(upload_to='profile_pics', blank=True)
    pic2 = models.ImageField(upload_to='profile_pics', blank=True)
    pic3 = models.ImageField(upload_to='profile_pics', blank=True)
    pic4 = models.ImageField(upload_to='profile_pics', blank=True)
    pic5 = models.ImageField(upload_to='profile_pics', blank=True)
    
    def __str__(self):
        return self.owner.owner.username


class ClassInfo(models.Model):
    name = models.CharField(max_length=200)
    teacher = models.ForeignKey(UserInfo, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class StudentClassRelationship(models.Model):
    c = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE) 


class Lecture(models.Model):
    name = models.CharField(max_length=200)
    slide_link = models.URLField()
    c = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    in_session = models.BooleanField(default=True)


class LectureAttendance(models.Model):
    lecture = models.ForeignKey(Lecture, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)


class Quiz(models.Model):
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=2000)
    time_created = models.DateTimeField(auto_now_add=True)
    class_id = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)
    active = models.BooleanField(default=False)
    released = models.BooleanField(default=False)
    score = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


class QuizQuestion(models.Model):
    quiz_id = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    question_number = models.PositiveIntegerField()
    question = models.CharField(max_length=200)
    
    answer_0 = models.CharField(max_length=200)
    answer_1 = models.CharField(max_length=200)
    answer_2 = models.CharField(max_length=200)
    answer_3 = models.CharField(max_length=200)

    correct_answer = models.PositiveIntegerField(validators=[MaxValueValidator(3, message="Only accepts values from 0 to 3")])

    def __str__(self):
        return self.quiz_id.name + ':' + str(self.question_number)




