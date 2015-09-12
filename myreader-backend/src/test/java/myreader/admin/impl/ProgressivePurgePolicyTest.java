//package myreader.admin.impl;
//
//import static org.junit.Assert.assertTrue;
//
//import java.util.ArrayList;
//import java.util.Date;
//import java.util.List;
//
//import myreader.admin.PurgeResult;
//import myreader.model.Entry;
//
//import org.junit.After;
//import org.junit.AfterClass;
//import org.junit.Before;
//import org.junit.BeforeClass;
//import org.junit.Test;
//
//public class ProgressivePurgePolicyTest {
//
//	private static List<Entry> purgeFrom;
//
//	private static ProgressivePurgePolicy policy;
//
//	@BeforeClass
//	public static void setUpBeforeClass() throws Exception {
//		purgeFrom = new ArrayList<Entry>();
//
//		policy = new ProgressivePurgePolicy();
//	}
//
//	@AfterClass
//	public static void tearDownAfterClass() throws Exception {
//	}
//
//	@Before
//	public void setUp() throws Exception {
//
//	}
//
//	@After
//	public void tearDown() throws Exception {
//		purgeFrom.clear();
//	}
//
//	private List<Entry> createDummyEntry(int count) {
//		List<Entry> l = new ArrayList<Entry>();
//
//		for (int i = count; i > 0; i--) {
//			Entry e = new Entry();
//			e.setTitle("title" + i);
//			e.setGuid("guid" + i);
//			e.setUrl("url" + i);
//			e.setCreatedOn(new Date(i * 1000));
//			e.setId(Long.valueOf(i));
//			e.setUnread(1);
//
//			l.add(e);
//		}
//		return l;
//	}
//
//	@Test
//	public void testEmptyList() {
//		purgeFrom.clear();
//		PurgeResult result = policy.findEntriesForPurge(purgeFrom);
//
//		assertTrue(result.toUpdate().size() == 0);
//		assertTrue(result.toPurge().size() == 0);
//	}
//
//	@Test
//	public void testThreshold() {
//		purgeFrom.addAll(createDummyEntry(75));
//
//		policy.findEntriesForPurge(purgeFrom);
//
//		int deleteThreshold = policy.getDeleteThreshold();
//
//		assertTrue(deleteThreshold == 5);
//	}
//
//	@Test
//	public void testWithUnreadEntries() {
//		purgeFrom.addAll(createDummyEntry(75));
//
//		PurgeResult result = policy.findEntriesForPurge(purgeFrom);
//
//		assertTrue(result.toUpdate().size() == 0);
//		assertTrue(result.toPurge().size() == 0);
//	}
//
//	@Test
//	public void testWithReadEntriesCannotDelete() {
//		List<Entry> mocks = createDummyEntry(75);
//
//		for (Entry e : mocks) {
//			e.setUnread(0);
//		}
//
//		purgeFrom.addAll(mocks);
//
//		PurgeResult result = policy.findEntriesForPurge(purgeFrom);
//
//		assertTrue(result.toUpdate().size() == 5);
//		assertTrue(result.toPurge().size() == 0);
//	}
//
//	@Test
//	public void testWithReadEntriesCanDelete() {
//		List<Entry> mocks = createDummyEntry(75);
//
//		for (Entry e : mocks) {
//			e.setUnread(0);
//			e.setDeleteCount(13);
//		}
//
//		purgeFrom.addAll(mocks);
//
//		PurgeResult result = policy.findEntriesForPurge(purgeFrom);
//
//		assertTrue(result.toUpdate().size() == 0);
//		assertTrue(result.toPurge().size() == 5);
//	}
//
//}
