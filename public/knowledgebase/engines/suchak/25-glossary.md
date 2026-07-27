# Suchak Engine — Glossary

**Version:** 2.3.1 | **Owner:** Data Events | **Last Updated:** 2026-07-24

---

## A

| Term | Definition |
|---|---|
| **Article** | A single news item or press release ingested from a news source feed |
| **Auto-Tagging** | NLP-based automatic assignment of entity tags (symbol, sector, event type) to incoming articles |

## B

| Term | Definition |
|---|---|
| **Bankruptcy Event** | Corporate action detected from news: company files for insolvency or bankruptcy protection |
| **Board Meeting** | Scheduled corporate governance event; Suchak detects announcements of agenda and outcomes |

## C

| Term | Definition |
|---|---|
| **Corporate Action** | Event initiated by a company affecting its securities — dividend, split, buyback, merger, rights issue |
| **Corpus** | Collection of all ingested and indexed news articles used for NLP model training and analysis |

## D

| Term | Definition |
|---|---|
| **Dividend Announcement** | Corporate action detected: company declares dividend with record date, ex-date, and amount |
| **Document Classification** | NLP task assigning a category label to a news article (e.g., earnings, regulatory, merger) |

## E

| Term | Definition |
|---|---|
| **Earnings Call** | Scheduled quarterly event where company management discusses financial results |
| **Entity Extraction** | NLP task identifying named entities in text — company names, tickers, people, dates, amounts |
| **Event API** | Suchak REST/gRPC endpoint delivering detected events to downstream consumers (DXCC, VYUH) |
| **Event Confidence** | Numeric score (0–100) indicating NLP model certainty that the detected event is accurate |
| **Ex-Date** | The date on or after which a security trades without a previously declared dividend or right |

## I

| Term | Definition |
|---|---|
| **Ingestion Pipeline** | Data processing chain: source fetch → normalization → NLP enrichment → event detection → publishing |
| **Insider Trading Event** | Detected regulatory filing or news about insider buying/selling activity |

## M

| Term | Definition |
|---|---|
| **Merger Announcement** | Corporate action detected: two companies announce merger or acquisition deal terms |
| **Multi-Source** | Suchak's ability to ingest and correlate news from multiple providers simultaneously |

## N

| Term | Definition |
|---|---|
| **Named Entity Recognition (NER)** | NLP subtask identifying and classifying named entities (person, org, location, date, ticker) in text |
| **News Sentiment** | Numeric score (-1.0 to +1.0) indicating positive, negative, or neutral tone of a news article |
| **NLP Pipeline** | Sequence of NLP models applied to text: tokenization → NER → classification → sentiment → event extraction |

## R

| Term | Definition |
|---|---|
| **RBI Policy** | Reserve Bank of India monetary policy announcements detected and classified by Suchak |
| **Record Date** | The date on which a shareholder must be on the company's books to receive a dividend or right |
| **Regulatory Filing** | Official document filed with SEBI, RBI, or stock exchanges — detected for material disclosures |

## S

| Term | Definition |
|---|---|
| **SEBI Announcement** | Regulatory announcement from the Securities and Exchange Board of India |
| **Sentiment Analysis** | NLP technique determining the emotional tone (positive/negative/neutral) of news text |
| **Source Adapter** | Pluggable module that connects to a specific news provider API and normalizes the data format |
| **Stock Split** | Corporate action where a company divides existing shares into multiple shares |

## T

| Term | Definition |
|---|---|
| **Text Normalization** | Preprocessing step: HTML stripping, encoding fixes, duplicate detection, language identification |
| **Tokenization** | First NLP step: splitting raw text into individual words, phrases, or symbols (tokens) |

## U

| Term | Definition |
|---|---|
| **Unstructured Data** | Raw news articles in natural language — Suchak's primary input format before NLP processing |
