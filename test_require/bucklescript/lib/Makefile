include ../Makefile.shared

CAMLC=../bin/bsc

SOURCE_LIST := $(shell cat lib.mllib)

RUNTIME := $(addsuffix .cmj, $(SOURCE_LIST))

INCLUDES := -I ../runtime

COMPFLAGS = $(MODULE_FLAGS)


$(RUNTIME): $(CAMLC)

all: $(RUNTIME)

clean::
	rm -f *.cm*
	rm -f *~
	rm -f  *.annot
	rm -f *.rawlambda *.lam *.lambda *.map


.mli.cmi:
	$(CAMLC) $(INCLUDES) $(COMPFLAGS)  -c $<
.ml.cmj:
	$(CAMLC) $(INCLUDES) $(COMPFLAGS)  -c $<

-include .libdepend

depend:
	$(CAMLDEP) $(INCLUDES) *.mli *.ml | sed -e 's/\.cmx/.cmj/g' > .libdepend

