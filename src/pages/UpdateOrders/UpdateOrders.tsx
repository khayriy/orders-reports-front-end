/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Button, Cascader, Form, Input, Segmented } from "antd";
import { CarOutlined, CheckOutlined, NodeIndexOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { statusUpdateData } from "../../data/statusData";
import { updateOrders, updateOrdersShip } from "../../store/orderSlice/orderSlice";
import { getAllShips } from "../../store/shipSlice/shipSlice";
import DispatchInterface from "../../types/DispatchInterface";
import OrdersWithStates from "./OrdersWithStates";
import styles from "./updateOrders.module.scss";

const { TextArea } = Input;

type Mode = "status" | "ship";
type State = "done" | "todo" | "error" | "hidden";
interface Item {
  key: string;
  label: string;
  state: State;
  note: string;
}

const cls = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const truncate = (s: string, n = 28) => (s.length > n ? `${s.slice(0, n)}…` : s);

const focusField = (key: string) => {
  const el = document.getElementById(`field-${key}`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add(styles.flash);
  window.setTimeout(() => el.classList.remove(styles.flash), 1500);
  window.setTimeout(() => {
    (el.querySelector("input, textarea") as HTMLElement | null)?.focus({ preventScroll: true });
  }, 350);
};

const labelOf = (options: any[] | undefined, value: any): string => {
  const first = Array.isArray(value) ? value[0] : value;
  const found = (options ?? []).find((o: any) => o.value === first);
  return String(found?.label ?? first ?? "");
};

const StepBadge = ({ n, state }: { n: number; state: string }) => (
  <span className={styles.stepBadge} data-state={state}>
    {state === "done" ? <CheckOutlined /> : state === "error" ? "!" : n}
  </span>
);

const UpdateOrders = () => {
  const dispatch: DispatchInterface = useDispatch();
  const { ships, isWaitingForShips } = useSelector((state: any) => state.ship);
  const { token } = useSelector((state: any) => state.auth);
  const { isWaitingForUpdateManyOrders } = useSelector((state: any) => state.order);

  const [mode, setMode] = useState<Mode>("status");
  const [orders, setOrders] = useState("");
  const [state, setState] = useState<any>(undefined);
  const [shipId, setShipId] = useState<any>(undefined);
  const [notes, setNotes] = useState("");
  const [attempted, setAttempted] = useState(false);

  // one id per line: trimmed, no blanks, no repeats
  const { ids, duplicates } = useMemo(() => {
    const lines = orders
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    const unique = Array.from(new Set(lines));
    return { ids: unique, duplicates: lines.length - unique.length };
  }, [orders]);

  // ships are only needed for the "change ship" mode
  useEffect(() => {
    if (mode !== "ship" || ships?.length > 0) return;
    dispatch(getAllShips({ url: "ship", token }));
  }, [dispatch, token, mode, ships]);

  const shipOptions = useMemo(
    () => (ships ?? []).map(({ _id, name }: any) => ({ value: _id, label: name })),
    [ships]
  );

  const isStatus = mode === "status";
  const valueLabel = isStatus ? labelOf(statusUpdateData as any, state) : labelOf(shipOptions, shipId);
  const hasValue = isStatus ? Boolean(state?.[0]) : Boolean(shipId?.[0]);
  const ready = ids.length > 0 && hasValue;

  // ---- checklist ----
  const items: Item[] = [
    ids.length > 0
      ? {
          key: "orders",
          label: "أرقام الطلبات",
          state: "done",
          note: `${ids.length.toLocaleString("en-US")} رقم${duplicates > 0 ? ` (تم تجاهل ${duplicates} مكرر)` : ""}`,
        }
      : {
          key: "orders",
          label: "أرقام الطلبات",
          state: attempted ? "error" : "todo",
          note: attempted ? "اكتب رقم طلب واحد على الأقل" : "مطلوب",
        },
    hasValue
      ? { key: "value", label: isStatus ? "الحالة الجديدة" : "مسئول الشحن", state: "done", note: valueLabel }
      : {
          key: "value",
          label: isStatus ? "الحالة الجديدة" : "مسئول الشحن",
          state: attempted ? "error" : "todo",
          note: attempted ? (isStatus ? "اختر الحالة المراد التحويل لها" : "اختر مسئول الشحن") : "مطلوب",
        },
    {
      key: "notes",
      label: "ملاحظات",
      state: isStatus && notes.trim() ? "done" : "hidden",
      note: truncate(notes.trim()),
    },
  ];
  const visible = items.filter((i) => i.state !== "hidden");
  const doneCount = visible.filter((i) => i.state === "done").length;
  const problems = visible.length - doneCount;
  const percent = visible.length ? Math.round((doneCount / visible.length) * 100) : 0;

  const step1State = items[0].state === "done" ? "done" : items[0].state === "error" ? "error" : "todo";
  const step2State = items[1].state === "done" ? "done" : items[1].state === "error" ? "error" : "todo";

  // ---- submit ----
  const submit = () => {
    if (isStatus) {
      const data: any = { orders: ids, status: state ? state[0] : "" };
      if (notes.trim() !== "") data.notes = notes;
      dispatch(
        updateOrders({
          url: "order/updateMany",
          toastMessage: "تم تعديل الطلبات بنجاح",
          data,
          clearForm: () => {
            setNotes("");
            setOrders("");
            setAttempted(false);
          },
          token,
        })
      );
    } else {
      dispatch(
        updateOrdersShip({
          url: "order/updateShip",
          toastMessage: "تم تعديل الطلبات بنجاح",
          data: { orders: ids, ship_id: shipId ? shipId[0] : "" },
          clearForm: () => {
            setOrders("");
            setShipId(undefined);
            setAttempted(false);
          },
          token,
        })
      );
    }
  };

  // always clickable: if something is missing it explains and jumps to it
  const attempt = () => {
    setAttempted(true);
    if (ready) {
      submit();
      return;
    }
    focusField(ids.length === 0 ? "orders" : "value");
  };

  const operation = isStatus
    ? `سيتم تغيير حالة ${ids.length.toLocaleString("en-US")} طلب إلى «${valueLabel}»`
    : `سيتم تحويل ${ids.length.toLocaleString("en-US")} طلب إلى مسئول الشحن «${valueLabel}»`;

  return (
    <div className={styles.page}>
      <Form
        layout="vertical"
        className={styles.form}
        onSubmitCapture={(e) => {
          e.preventDefault();
          attempt();
        }}
      >
        <div className={styles.main}>
          {/* results from the last submit, shown where the user is already looking */}
          <OrdersWithStates />

          <section className={cls(styles.card, step1State === "done" && styles.card_done, step1State === "error" && styles.card_error)}>
            <header className={styles.cardHead}>
              <StepBadge n={1} state={step1State} />
              <div className={styles.headText}>
                <h2 className={styles.cardTitle}>الطلبات المراد تعديلها</h2>
                <span className={styles.cardHint}>اكتب رقم كل طلب في سطر مستقل</span>
              </div>
              {ids.length > 0 && <span className={styles.stepCount}>{ids.length.toLocaleString("en-US")}</span>}
            </header>

            <div id="field-orders" className={styles.field}>
              <Form.Item label="أرقام الطلبات" required className={styles.noMargin}>
                <TextArea
                  value={orders}
                  onChange={(e) => setOrders(e.target.value)}
                  placeholder="اكتب ارقام الطلبات على ان يكون كل رقم في سطر"
                  autoSize={{ minRows: 6, maxRows: 14 }}
                  className={styles.ids}
                />
              </Form.Item>
              {duplicates > 0 && (
                <p className={styles.note}>تم تجاهل {duplicates.toLocaleString("en-US")} رقم مكرر</p>
              )}
            </div>
          </section>

          <section className={cls(styles.card, step2State === "done" && styles.card_done, step2State === "error" && styles.card_error)}>
            <header className={styles.cardHead}>
              <StepBadge n={2} state={step2State} />
              <div className={styles.headText}>
                <h2 className={styles.cardTitle}>التعديل المطلوب</h2>
                <span className={styles.cardHint}>اختر نوع التعديل ثم القيمة الجديدة</span>
              </div>
            </header>

            <Segmented
              className={styles.modes}
              size="large"
              value={mode}
              onChange={(v) => {
                setMode(v as Mode);
                setAttempted(false);
              }}
              options={[
                {
                  value: "status",
                  label: (
                    <span className={styles.modeLabel}>
                      <NodeIndexOutlined /> تعديل الحالة
                    </span>
                  ),
                },
                {
                  value: "ship",
                  label: (
                    <span className={styles.modeLabel}>
                      <CarOutlined /> تعديل الشحن
                    </span>
                  ),
                },
              ]}
            />

            <div id="field-value" className={styles.field}>
              {isStatus ? (
                <Form.Item label="الحالة الجديدة" required>
                  <Cascader
                    style={{ width: "100%" }}
                    size="large"
                    options={statusUpdateData as any}
                    value={state}
                    onChange={(e: any) => setState(e)}
                    placeholder="اختر الحالة المراد التحويل لها"
                  />
                </Form.Item>
              ) : (
                <Form.Item label="مسئول الشحن" required>
                  <Cascader
                    style={{ width: "100%" }}
                    size="large"
                    options={shipOptions}
                    value={shipId}
                    loading={isWaitingForShips}
                    onChange={(e: any) => setShipId(e)}
                    placeholder="اختر مسئول الشحن المراد التحويل له"
                  />
                </Form.Item>
              )}
            </div>

            {isStatus && (
              <div id="field-notes" className={styles.field}>
                <Form.Item label="ملاحظات (اختياري)" className={styles.noMargin}>
                  <TextArea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ملاحظات على هذه الطلبات"
                    autoSize={{ minRows: 3, maxRows: 5 }}
                  />
                </Form.Item>
              </div>
            )}
          </section>
        </div>

        {/* ---------------- Summary / checklist ---------------- */}
        <aside className={styles.side}>
          <section className={styles.summary}>
            <h2 className={styles.summaryTitle}>ملخص العملية</h2>

            <div className={styles.progress}>
              <div className={styles.progressTop}>
                <span>اكتمال البيانات</span>
                <b>
                  {doneCount}/{visible.length}
                </b>
              </div>
              <div
                className={styles.bar}
                role="progressbar"
                aria-label="اكتمال البيانات"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
              >
                <span style={{ width: `${percent}%` }} />
              </div>
            </div>

            <ul className={styles.checklist}>
              {visible.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={styles.check}
                    data-state={item.state}
                    onClick={() => focusField(item.key)}
                  >
                    <span className={styles.mark}>
                      {item.state === "done" ? <CheckOutlined /> : item.state === "error" ? "!" : ""}
                    </span>
                    <span className={styles.checkText}>
                      <b>{item.label}</b>
                      <small>{item.note}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            {ready ? (
              <p className={styles.operation}>{operation}</p>
            ) : (
              <p className={styles.status} aria-live="polite">
                {attempted
                  ? `يوجد ${problems} بند يحتاج إلى مراجعة. اضغط على أي بند للانتقال إليه.`
                  : `متبقي ${problems} بند قبل تأكيد التعديل.`}
              </p>
            )}

            <Button
              type="primary"
              className={cls(styles.submit, ready && styles.ready)}
              onClick={attempt}
              loading={isWaitingForUpdateManyOrders}
              disabled={isWaitingForUpdateManyOrders}
            >
              تأكيد التعديل
            </Button>
          </section>
        </aside>
      </Form>
    </div>
  );
};

export default UpdateOrders;