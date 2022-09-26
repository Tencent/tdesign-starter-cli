import { createVuePlugin } from "vite-plugin-vue2";
import { createSvgPlugin } from 'vite-plugin-vue2-svg';

export default {
    plugins: [createVuePlugin(), createSvgPlugin()]
}