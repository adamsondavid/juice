import { ref, computed } from "@/juice";

function Info() {
  return (
    <>
      <h1 class="text-2xl">
        hello <span class="text-orange-500">Juice</span>
      </h1>
      <div class="py-2">
        <p class="text-xs font-bold">This is a small PoC for reactively rendering JSX.</p>
        <p class="text-xs font-bold">Juice is inpired by React and Vue, but offers way less features.</p>
      </div>
    </>
  );
}

function Button(props) {
  return (
    <button onclick={props.onclick} class="rounded p-1 text-sm text-white bg-blue-600 hover:bg-blue-700">
      {props.children}
    </button>
  );
}

function App() {
  const count = ref(0);
  const doubled = computed(() => count.value * 2);

  return (
    <div class="p-4">
      <Info />
      <div>
        <Button onclick={() => count.value++}>
          Count is: <span class="font-mono">{count}</span>
        </Button>
      </div>
      Doubled count is: <span class="text-green-500">{doubled}</span>
      {computed(() => doubled.value > 10 && <div>Doubled count is greater than 10</div>)}
    </div>
  );
}

document.body.append(App());
