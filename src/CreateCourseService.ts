/**
 * @description - Service to create a course
 */

interface ICourse {
    name: string;
    duration?: number;
    educator: string;
}

class CreateCourseService {
    execute({ name, duration = 12, educator }: ICourse) {
        console.log(
            `Creating course ${name} with duration ${duration} and educator ${educator}`
        );
    }
}

export default new CreateCourseService();
