import { useCallback, useState } from "react";
import type {
  AssignmentStatus,
  CourseStatus,
  DbAssignment,
  DbCourse,
  DbGroup,
  DbLesson,
  DbStudent,
  StudentStatus,
} from "../types";

type JsonMap = Record<string, unknown>;

async function asJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function useTeacherEntities() {
  const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
  const [dbLessons, setDbLessons] = useState<DbLesson[]>([]);
  const [dbGroups, setDbGroups] = useState<DbGroup[]>([]);
  const [dbStudents, setDbStudents] = useState<DbStudent[]>([]);
  const [dbAssignments, setDbAssignments] = useState<DbAssignment[]>([]);
  const [dbLoading, setDbLoading] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  const [isSavingCourse, setIsSavingCourse] = useState(false);
  const [isSavingLesson, setIsSavingLesson] = useState(false);
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isSavingAssignment, setIsSavingAssignment] = useState(false);

  const loadTeacherEntities = useCallback(async () => {
    setDbLoading(true);
    setDbError(null);

    try {
      const [coursesRes, lessonsRes, groupsRes, studentsRes, assignmentsRes] = await Promise.all([
        fetch("/api/teacher/courses", { cache: "no-store" }),
        fetch("/api/teacher/lessons", { cache: "no-store" }),
        fetch("/api/teacher/groups", { cache: "no-store" }),
        fetch("/api/teacher/students", { cache: "no-store" }),
        fetch("/api/teacher/assignments", { cache: "no-store" }),
      ]);

      const [coursesData, lessonsData, groupsData, studentsData, assignmentsData] =
        await Promise.all([
          asJson<JsonMap | DbCourse[]>(coursesRes),
          asJson<JsonMap | DbLesson[]>(lessonsRes),
          asJson<JsonMap | DbGroup[]>(groupsRes),
          asJson<JsonMap | DbStudent[]>(studentsRes),
          asJson<JsonMap | DbAssignment[]>(assignmentsRes),
        ]);

      if (
        !coursesRes.ok ||
        !lessonsRes.ok ||
        !groupsRes.ok ||
        !studentsRes.ok ||
        !assignmentsRes.ok
      ) {
        const message =
          (coursesData as JsonMap)?.error ||
          (lessonsData as JsonMap)?.error ||
          (groupsData as JsonMap)?.error ||
          (studentsData as JsonMap)?.error ||
          (assignmentsData as JsonMap)?.error ||
          "Не вдалося завантажити дані кабінету вчителя";
        throw new Error(String(message));
      }

      setDbCourses(Array.isArray(coursesData) ? coursesData : []);
      setDbLessons(Array.isArray(lessonsData) ? lessonsData : []);
      setDbGroups(Array.isArray(groupsData) ? groupsData : []);
      setDbStudents(Array.isArray(studentsData) ? studentsData : []);
      setDbAssignments(Array.isArray(assignmentsData) ? assignmentsData : []);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Не вдалося завантажити дані кабінету вчителя";
      setDbError(message);
    } finally {
      setDbLoading(false);
    }
  }, []);

  const createCourse = useCallback(
    async (payload: { title: string; topic: string; status: CourseStatus }) => {
      setIsSavingCourse(true);
      setDbError(null);
      try {
        const response = await fetch("/api/teacher/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const body = await asJson<JsonMap>(response);
        if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося створити курс"));
        await loadTeacherEntities();
      } catch (error) {
        setDbError(error instanceof Error ? error.message : "Не вдалося створити курс");
      } finally {
        setIsSavingCourse(false);
      }
    },
    [loadTeacherEntities],
  );

  const updateCourse = useCallback(
    async (payload: { id: string; title: string; topic: string; status: CourseStatus }) => {
      setDbError(null);
      const response = await fetch("/api/teacher/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося оновити курс"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const deleteCourse = useCallback(
    async (id: string) => {
      setDbError(null);
      const response = await fetch(`/api/teacher/courses?id=${id}`, { method: "DELETE" });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося видалити курс"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const createLesson = useCallback(
    async (payload: {
      title: string;
      courseId: string | null;
      groupName: string;
      status: CourseStatus;
    }) => {
      setIsSavingLesson(true);
      setDbError(null);
      try {
        const response = await fetch("/api/teacher/lessons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await asJson<JsonMap>(response);
        if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося створити урок"));
        await loadTeacherEntities();
      } catch (error) {
        setDbError(error instanceof Error ? error.message : "Не вдалося створити урок");
      } finally {
        setIsSavingLesson(false);
      }
    },
    [loadTeacherEntities],
  );

  const updateLesson = useCallback(
    async (payload: {
      id: string;
      title: string;
      courseId: string | null;
      groupName: string;
      status: CourseStatus;
    }) => {
      setDbError(null);
      const response = await fetch("/api/teacher/lessons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося оновити урок"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const deleteLesson = useCallback(
    async (id: string) => {
      setDbError(null);
      const response = await fetch(`/api/teacher/lessons?id=${id}`, { method: "DELETE" });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося видалити урок"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const createGroup = useCallback(
    async (payload: { name: string }) => {
      setIsSavingGroup(true);
      setDbError(null);
      try {
        const response = await fetch("/api/teacher/groups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await asJson<JsonMap>(response);
        if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося створити групу"));
        await loadTeacherEntities();
      } catch (error) {
        setDbError(error instanceof Error ? error.message : "Не вдалося створити групу");
      } finally {
        setIsSavingGroup(false);
      }
    },
    [loadTeacherEntities],
  );

  const updateGroup = useCallback(
    async (payload: { id: string; name: string }) => {
      setDbError(null);
      const response = await fetch("/api/teacher/groups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося оновити групу"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const deleteGroup = useCallback(
    async (id: string) => {
      setDbError(null);
      const response = await fetch(`/api/teacher/groups?id=${id}`, { method: "DELETE" });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося видалити групу"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const createStudent = useCallback(
    async (payload: {
      fullName: string;
      email: string;
      phone: string;
      telegram: string;
      note: string;
      groupId: string | null;
    }) => {
      setIsSavingStudent(true);
      setDbError(null);
      try {
        const response = await fetch("/api/teacher/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await asJson<JsonMap>(response);
        if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося створити учня"));
        await loadTeacherEntities();
      } catch (error) {
        setDbError(error instanceof Error ? error.message : "Не вдалося створити учня");
      } finally {
        setIsSavingStudent(false);
      }
    },
    [loadTeacherEntities],
  );

  const updateStudentStatus = useCallback(
    async (payload: { id: string; status: StudentStatus }) => {
      setDbError(null);
      const response = await fetch("/api/teacher/students", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося оновити статус учня"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const deleteStudent = useCallback(
    async (id: string) => {
      setDbError(null);
      const response = await fetch(`/api/teacher/students?id=${id}`, { method: "DELETE" });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося видалити учня"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const createAssignment = useCallback(
    async (payload: {
      title: string;
      target: string;
      status: AssignmentStatus;
      comment: string;
      deadlineAt: string | null;
      lessonId: string | null;
    }) => {
      setIsSavingAssignment(true);
      setDbError(null);
      try {
        const response = await fetch("/api/teacher/assignments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const body = await asJson<JsonMap>(response);
        if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося створити завдання"));
        await loadTeacherEntities();
      } catch (error) {
        setDbError(error instanceof Error ? error.message : "Не вдалося створити завдання");
      } finally {
        setIsSavingAssignment(false);
      }
    },
    [loadTeacherEntities],
  );

  const updateAssignment = useCallback(
    async (payload: {
      id: string;
      title: string;
      target: string;
      status: AssignmentStatus;
      comment: string;
      deadlineAt: string | null;
    }) => {
      setDbError(null);
      const response = await fetch("/api/teacher/assignments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося оновити завдання"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  const deleteAssignment = useCallback(
    async (id: string) => {
      setDbError(null);
      const response = await fetch(`/api/teacher/assignments?id=${id}`, { method: "DELETE" });
      const body = await asJson<JsonMap>(response);
      if (!response.ok) throw new Error(String(body?.error ?? "Не вдалося видалити завдання"));
      await loadTeacherEntities();
    },
    [loadTeacherEntities],
  );

  return {
    dbCourses,
    dbLessons,
    dbGroups,
    dbStudents,
    dbAssignments,
    dbLoading,
    dbError,
    setDbError,
    isSavingCourse,
    isSavingLesson,
    isSavingGroup,
    isSavingStudent,
    isSavingAssignment,
    loadTeacherEntities,
    createCourse,
    updateCourse,
    deleteCourse,
    createLesson,
    updateLesson,
    deleteLesson,
    createGroup,
    updateGroup,
    deleteGroup,
    createStudent,
    updateStudentStatus,
    deleteStudent,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
