import dynamic from "next/dynamic";

// Import dynamically without disabling SSR
const Home = dynamic(() => import("./component/home"));

export default function Page() {
  return (
    <>
      <Home />
    </>
  );
}
