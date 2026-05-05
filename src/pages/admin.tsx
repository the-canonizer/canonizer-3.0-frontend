import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { Input, Select, Table, Tag, message } from "antd";

import { RootState } from "src/store";
import {
  adminListTopics,
  assignTopicCategory,
  getTopicCategories,
} from "src/network/api/topicAPI";

type TopicRow = {
  topic_num: number;
  topic_name: string;
  category_id: number | null;
  category_name: string | null;
  is_sandbox: number;
};

type Category = { id: number; name: string; description?: string | null };

const AdminPage = () => {
  const loggedInUser: any = useSelector(
    (state: RootState) => (state as any).auth?.loggedInUser
  );
  const isAdmin = loggedInUser?.type === "admin";

  const [topics, setTopics] = useState<TopicRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    const [topicsRes, catsRes] = await Promise.all([
      adminListTopics(),
      getTopicCategories(),
    ]);
    if (topicsRes?.status_code === 200)
      setTopics((topicsRes.data || []) as TopicRow[]);
    else message.error(topicsRes?.message || "Failed to load topics");
    if (catsRes?.status_code === 200)
      setCategories((catsRes.data || []) as Category[]);
    else message.error(catsRes?.message || "Failed to load categories");
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const filtered = useMemo(() => {
    if (!search) return topics;
    const q = search.toLowerCase();
    return topics.filter((t) =>
      (t.topic_name || "").toLowerCase().includes(q)
    );
  }, [topics, search]);

  const handleAssign = async (row: TopicRow, newCategoryId: number) => {
    const r = await assignTopicCategory({
      topic_num: row.topic_num,
      category_id: newCategoryId,
    });
    if (r?.status_code === 200) {
      const cat = categories.find((c) => c.id === newCategoryId);
      setTopics((prev) =>
        prev.map((t) =>
          t.topic_num === row.topic_num
            ? {
                ...t,
                category_id: newCategoryId,
                category_name: cat?.name ?? null,
              }
            : t
        )
      );
      message.success("Category updated");
    } else {
      message.error(r?.message || "Update failed");
    }
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: "3rem", textAlign: "center" }}>
        <h2>403 — Admin only</h2>
        <p>You need an admin account to view this page.</p>
        <Link href="/">Back to home</Link>
      </div>
    );
  }

  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const columns = [
    {
      title: "#",
      dataIndex: "topic_num",
      width: 70,
      sorter: (a: TopicRow, b: TopicRow) => a.topic_num - b.topic_num,
    },
    {
      title: "Topic",
      dataIndex: "topic_name",
      render: (name: string, row: TopicRow) => (
        <Link
          href={`/topic/${row.topic_num}-${(name || "").replace(/\s+/g, "-")}/1-Agreement`}
        >
          {name}
        </Link>
      ),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      width: 240,
      render: (currentId: number | null, row: TopicRow) => (
        <Select
          size="small"
          style={{ width: 220 }}
          value={currentId ?? undefined}
          placeholder="Unassigned"
          options={categoryOptions}
          onChange={(v) => handleAssign(row, v)}
          showSearch
          optionFilterProp="label"
        />
      ),
    },
    {
      title: "Sandbox",
      dataIndex: "is_sandbox",
      width: 100,
      render: (s: number) =>
        s === 1 ? <Tag color="orange">Sandbox</Tag> : <span>—</span>,
    },
  ];

  return (
    <div
      style={{
        padding: "1.5rem",
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16 }}>
        Admin · Topics
      </h1>
      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Input.Search
          placeholder="Search topic name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320 }}
          allowClear
        />
        <span
          style={{ marginLeft: "auto", alignSelf: "center", color: "#888" }}
        >
          {filtered.length} of {topics.length}
        </span>
      </div>
      <Table
        rowKey="topic_num"
        columns={columns as any}
        dataSource={filtered}
        loading={loading}
        pagination={{ pageSize: 50 }}
        size="small"
      />
    </div>
  );
};

AdminPage.displayName = "AdminPage";

export default AdminPage;
