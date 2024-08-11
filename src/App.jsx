import { useEffect, useState } from "react";

export default function App() {
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    return storedTheme === "true";
  });
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  function handleDownload(download, name) {
    // const link = document.createElement("a");
    // link.href = download;
    // link.download = name;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChuld(link);
  }
  function changeTheme() {
    setTheme(!theme);
  }

  useEffect(() => {
    async function dataFetch() {
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=45357744-b11b46dcdb558e25719f1b87e&q=nature&image_type=photo&pretty=true`,
        );
        const data = await res.json();
        setImages(data.hits);
      } catch (err) {
        setError(err);
        console.log(err);
      }
    }
    dataFetch();
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    async function Search() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://pixabay.com/api/?key=45357744-b11b46dcdb558e25719f1b87e&q=${query}e&image_type=photo&pretty=true`,
          { signal: controller.signal },
        );
        const data = await res.json();
        setLoading(false);
        setImages(data.hits);
      } catch (err) {
        setLoading(false);
      } finally {
        setLoading(false);
      }
      return () => {
        controller.abort();
      };
    }
    if (query.trim()) {
      Search();
      console.log(query.trim());
    }
  }, [query]);
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className={`${theme ? "dark" : ""} border-black`}>
      <Header
        onChangeTheme={changeTheme}
        theme={theme}
        onQuery={(e) => setQuery(e.target.value)}
        query={query}
        images={images}
      />

      <Image
        image={images}
        onDownload={handleDownload}
        loading={loading}
        query={query}
      />
    </div>
  );
}

function Header({ onChangeTheme, onQuery, query, images }) {
  return (
    <div className="mb-1 flex items-center justify-around bg-sky-500 p-3 shadow-sm shadow-black dark:bg-stone-600 dark:shadow-stone-800">
      <p className="text-xs font-medium text-sky-50 sm:text-xl">
        Images found: <span className="text-red-500">{images.length}</span>
      </p>
      <ThemeBtn onChangeTheme={onChangeTheme} onQuery={onQuery} query={query} />
    </div>
  );
}
function Image({ image, onDownload, loading, query }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-sky-100 dark:bg-stone-800">
      {loading ? (
        <Loader />
      ) : image.length ? (
        <ul className="grid w-full grid-cols-2 items-center gap-1 overflow-y-auto sm:grid-cols-3">
          {image.map((img) => (
            <ImageItem image={img} key={img.id} onDownload={onDownload} />
          ))}
        </ul>
      ) : (
        <ErrorMessage message={query} />
      )}
    </div>
  );
}

function ImageItem({ image, onDownload }) {
  const arrysTags = image.tags.split(",");
  return (
    <li className="py-1 w-full  border-gray-200 dark:border-stone-400 sm:h-full">
      <div className="sm:h-72 h-52">
        <img
          className="h-full w-full object-cover"
          src={image.largeImageURL}
          alt={image.user}
        />
      </div>
      <div className="bg-white p-2 text-[0.5rem] dark:bg-stone-600 sm:text-base">
        <h1 className="font-mono text-[0.6rem] font-semibold text-indigo-600 dark:text-white sm:text-base">
          Photo by {image.user}
        </h1>
        <p className="text-cyan-600 dark:text-lime-100">Veiws: {image.views}</p>
        <p className="text-lime-500">Downloads: {image.downloads}</p>
        <p className="text-sky-400 dark:text-green-500">
          Comments: {image.comments}
        </p>
        <p className="text-sky-500 dark:text-blue-200">Likes: {image.likes}</p>
        <button
          onClick={() => onDownload(image.pageURL, "image1")}
          className="text-emerald-400 hover:text-green-200"
        >
          &darr; Download image
        </button>
        <div className="my-2 flex flex-wrap content-between items-center gap-2 space-x-1">
          {arrysTags.map((tag, index) => (
            <ImageFooter message={tag} key={index} />
          ))}
        </div>
      </div>
    </li>
  );
}
function ImageFooter({ message }) {
  return (
    <p className="rounded-md bg-green-100 px-3 py-1 text-[0.5rem] text-stone-600 dark:bg-lime-400 dark:text-white sm:text-base">
      # {message}
    </p>
  );
}
function ThemeBtn({ onChangeTheme, onQuery, query }) {
  return (
    <>
      <button title="Change theme">
        <label className="swap swap-rotate">
          <input
            type="checkbox"
            className="theme-controller"
            value="synthwave"
            onClick={onChangeTheme}
          />

          {/* sun icon */}
          <svg
            className="swap-off h-5 w-5 fill-white sm:h-10 sm:w-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-on h-5 w-5 fill-slate-300 sm:h-10 sm:w-10"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </button>
      <label className="sm:h-base input input-bordered flex h-8 w-36 items-center gap-2 bg-slate-50 sm:w-auto">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          onChange={onQuery}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </>
  );
}
function Loader() {
  return (
    <span className="loading loading-spinner text-error sm:h-14 sm:w-14"></span>
  );
}

function ErrorMessage({ message }) {
  return (
    <div
      role="alert"
      className="alert alert-error w-48 bg-sky-500 text-sky-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message} not found</span>
    </div>
  );
}
