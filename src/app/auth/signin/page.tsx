import { signIn } from \"next-auth/react\";

export default function SignIn() {
  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={() => signIn(\"doneisbetter-sso\")}>Sign in with DoneIsBetter SSO</button>
    </div>
  );
}
