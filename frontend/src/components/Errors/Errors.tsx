interface ErrorProps {
  errors: Record<string, string>
}
export const Errors = ({ errors }: ErrorProps) => {
  const allErrors = Object.entries(errors)
  return allErrors.map(([errorType, msg]) => <div key={errorType}>{msg}</div>)
}
