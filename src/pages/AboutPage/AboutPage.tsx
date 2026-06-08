import './AboutPage.css';

export function AboutPage() {
    return (
        <section className="about">
            <h1 className="about-title">About This App</h1>

            <p className="about-author">Author: Artem</p>

            <p className="about-text">
                This application was created as part of the RS School React
                course.
            </p>

            <a
                className="text-link"
                href="https://rs.school/courses/reactjs"
                target="_blank"
                rel="noopener noreferrer"
            >
                RS School React Course
            </a>
        </section>
    );
}
