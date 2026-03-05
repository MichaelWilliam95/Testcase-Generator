import InputBox  from './InputBox.jsx';

export default function App() {

  return (
    <>
      <homePage >
        <div className='title'>
        <h1>Test Case generator</h1>
        </div>
        <div className='inputbox'>
        <InputBox />
        </div>
        <div className='generateSection'>
          <button>
            Generate
            </button>
          <button>
            download
          </button>
          <fieldset></fieldset>
        </div>
      </homePage>
    </>
  );
}

