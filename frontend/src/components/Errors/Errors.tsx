interface ErrorProps {
  errors: Record<string, string> | string
}
export const Errors = ({ errors }: ErrorProps) => {
  if (typeof errors === "string") {
    return <div className="error">{errors}</div>
  } else if (typeof errors === "object") {
    const allErrors = Object.entries(errors)
    return allErrors.map(([errorType, msg]) => <div key={errorType}>{msg}</div>)
  }
}
