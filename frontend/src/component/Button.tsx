type Props = {
    content: string
}

const Button = ({content}:Props) => {
    return <button className="btn btn-primary">{content}</button>
}

export default Button