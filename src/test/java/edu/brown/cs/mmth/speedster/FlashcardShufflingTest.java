// /**
//  * See package-info.java file.
//  */
// package edu.brown.cs.mmth.speedster;

// import static org.junit.Assert.assertTrue;

// import java.util.ArrayList;
// import java.util.Collection;

// import org.junit.Test;

// /**
//  * Tests for shuffling! Makes sure shuffler object
//  * follows rules of session. 
//  * @author tbhargav
//  *
//  */
// public class FlashcardShufflingTest {
//   @Test
//   /**
//    * Makes sure given 3 cards, no card is
//    * repeated more than once in a shuffle!
//    */
//   public void basicShuffleTest() {
//     // Flashcards to shuffle. 
//     Flashcard obj1=new Flashcard("Why life?","42");
//     Flashcard obj2=new Flashcard("Why not?","41");
//     Flashcard obj3=new Flashcard("Favourite author?","Gerald Durrell");
    
//     // Making list.
//     Collection<Flashcard> cards=new ArrayList<>();
//     cards.add(obj1);
//     cards.add(obj2);
//     cards.add(obj3);
    
//     FlashcardShuffler shuffler1=new FlashcardShuffler(cards);
    
//     // Shuffling multiple times (in batches of 3) and making sure flashcard  is 
//     // never repeated.
//     for(int i=0;i<9000;i+=3) {
//       String q1=shuffler1.nextCard().getQuestion();
//       String q2=shuffler1.nextCard().getQuestion();
//       String q3=shuffler1.nextCard().getQuestion();
      
//       assertTrue(!q1.equals(q2));
//       assertTrue(!q1.equals(q3));
//       assertTrue(!q3.equals(q2));
//     }
//   }
// }
