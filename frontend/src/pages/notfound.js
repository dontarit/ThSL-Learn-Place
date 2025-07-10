import { Link } from "react-router-dom";

export default function NotFoundPage() {
    return (
        <>
        <h1>Page Not Found❌</h1>
        <Link to={"/"}>
            <button>Go back</button>
        </Link>
        </>
    )
}