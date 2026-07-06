type LoginHeaderProps = {
  title: string
  description: string
}

export default function LoginHeader({
  title,
  description,
}: LoginHeaderProps) {
  return (
    <>
      <div>Logo</div>

      <h1>{title}</h1>

      <p>
        {description}
      </p>
    </>
  )
}