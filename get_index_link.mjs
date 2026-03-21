import { initializeApp } from "firebase/app";
import { getFirestore, collection, query, where, orderBy, getDocs } from "firebase/firestore";

const firebaseConfig = {
  projectId: "folkvizag-b6830"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getLink() {
  try {
    const q = query(
      collection(db, 'accommodation_requests'),
      where('userId', '==', 'test'),
      orderBy('createdAt', 'desc')
    );
    await getDocs(q);
    console.log("No index required?");
  } catch (err) {
    if (err.message.includes('https://console.firebase.google.com')) {
      const link = err.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)[0];
      console.log("YOUR 1-CLICK FIRESTORE INDEX LINK IS:");
      console.log(link);
    } else {
      console.error("Error:", err.message);
    }
  }
  process.exit(0);
}
getLink();
